import { PaletteAnimation, Renderer } from "./rendering";
import { Tile, Zone, Sound, Char } from "./objects";

import Camera from "./camera";
import { EventTarget } from "src/util";
import Events from "./events";
import GameState from "./game-state";
import Hero from "./hero";
import { InputManager } from "./input";
import Inventory from "./inventory";
import Metronome from "./metronome";
import { Mixer, Channel } from "./audio";
import SceneManager from "./scene-manager";
import { ScriptProcessingUnit, HotspotProcessingUnit } from "./script";
import State from "./persistent-state";
import Story from "./story";
import { GameType as Type } from "./type";
import World from "./world";
import { SpeechScene, PickupScene } from "src/engine/scenes";
import { Point } from "src/util";
import Settings from "src/settings";
import Loader from "./loader";
import AssetManager, { NullIfMissing } from "./asset-manager";
import ResourceManager from "./resource-manager";

import { ConditionImplementations as Conditions } from "./script/conditions";
import { InstructionImplementations as Instructions } from "./script/instructions";

import Interface from "./interface";
import DummyInterface from "./dummy-interface";
import Sector from "./sector";
import calculateScore from "./score";
import { max } from "src/std/math";

export { Events };

class Engine extends EventTarget {
	static readonly Event = Events;

	public readonly type: Type = null;
	public assets: AssetManager = null;
	public resources: ResourceManager = null;
	public camera: Camera = new Camera();
	public hero: Hero = null;
	public inputManager: InputManager = null;
	public inventory: Inventory = null;
	public loader: Loader = null;
	public metronome: Metronome = null;
	public mixer: Mixer = null;
	public palette: PaletteAnimation = null;
	public persistentState: typeof State = State;
	public renderer: Renderer = null;
	public sceneManager: SceneManager = null;
	public spu: ScriptProcessingUnit = null;
	public story: Story = null;
	public temporaryState: {
		enteredByPlane: boolean;
		justEntered: boolean;
		bump: Point | false;
		totalPlayTime: number;
		currentPlayStart: Date;
	} = null;
	private _currentWorld: World = null;
	private _currentZone: Zone = null;
	private _updateInProgress: boolean = false;
	private _hpu: HotspotProcessingUnit;
	private _gameState: GameState = GameState.Stopped;
	private _currentSector: Sector;

	constructor(type: Type, ifce: Partial<Interface> = {}) {
		super();

		ifce = Object.assign({}, DummyInterface, ifce) as Interface;

		this.mixer = ifce.Mixer();

		this.resources = ifce.ResourceManager();
		this.assets = ifce.AssetManager();
		this.renderer = ifce.Renderer(null);
		this.sceneManager = ifce.SceneManager();
		this.inputManager = ifce.InputManager(null);
		this.metronome = ifce.Metronome();
		this.inventory = ifce.Inventory();
		this.spu = ifce.ScriptProcessingUnit(this, Instructions, Conditions);
		this.hero = ifce.Hero();
		this.loader = ifce.Loader(this);

		this.type = type;
		this._hpu = new HotspotProcessingUnit(this);
		// TODO: remove state
		this.temporaryState = {
			justEntered: true,
			enteredByPlane: true,
			bump: false,
			totalPlayTime: 0,
			currentPlayStart: new Date()
		};
		this.registerEvents(Events);
	}

	get dagobah() {
		return this.story.dagobah;
	}

	get world() {
		return this.story.world;
	}

	get currentZone() {
		return this._currentZone;
	}

	set currentZone(z) {
		this._currentZone = z;
		this.dispatchEvent(Events.CurrentZoneChange);
		this.dispatchEvent(Events.LocationChanged, { zone: z, world: this._currentWorld });
	}

	set currentSector(s) {}

	get currentSector() {
		return this.currentWorld.findSectorContainingZone(this.currentZone);
	}

	get currentWorld() {
		return this._currentWorld;
	}

	set currentWorld(w) {
		this._currentWorld = w;
	}

	update(ticks: number) {
		if (this._updateInProgress) console.warn("Reentering update!");
		this._updateInProgress = true;

		return this.sceneManager
			.update(ticks)
			.catch(e => console.warn("Update failed", e))
			.finally(() => (this._updateInProgress = false));
	}

	render() {
		this.sceneManager.render(this.renderer);
	}

	public consume(tile: Tile): void {
		if (!tile.isEdible) {
			const sound = this.assets.get(Sound, this.type.sounds.NoGo, NullIfMissing);
			this.mixer.play(sound, Channel.Effect);
			return;
		}

		const healthBonus = this.type.getHealthBonus(tile);
		if (healthBonus > 0 && this.hero.health >= Hero.MaxHealth) {
			const sound = this.assets.get(Sound, this.type.sounds.NoGo, NullIfMissing);
			this.mixer.play(sound, Channel.Effect);
			return;
		}
		this.hero.health += healthBonus;
		this.inventory.removeItem(tile);
		if (healthBonus < 0) {
			const sound = this.assets.get(Sound, this.type.sounds.Hurt, NullIfMissing);
			this.mixer.play(sound, Channel.Effect);
			return;
		}
	}

	public equip(tile: Tile): void {
		if (!tile.isWeapon) {
			const sound = this.assets.get(Sound, this.type.sounds.NoGo, NullIfMissing);
			this.mixer.play(sound, Channel.Effect);
			return;
		}

		if (!this.type.canBeEquipped(tile)) {
			const sound = this.assets.get(Sound, this.type.sounds.NoGo, NullIfMissing);
			this.mixer.play(sound, Channel.Effect);
			return;
		}

		const weaponChar = this.assets.find(Char, c => c.isWeapon && c.frames[0].extensionRight === tile);
		if (this.hero.weapon === weaponChar) return;

		this.hero.weapon = weaponChar;

		let ammo = this.hero.getAmmoForWeapon(weaponChar);
		if (!ammo) ammo = this.type.getMaxAmmo(weaponChar);
		this.hero.ammo = ammo;

		const equipSoundID = this.type.getEquipSound(weaponChar);
		const sound = this.assets.get(Sound, equipSoundID, NullIfMissing);
		this.mixer.play(sound, Channel.Effect);

		this.dispatchEvent(new CustomEvent(Events.WeaponChanged, { detail: { weapon: tile } }));
	}

	public speak(text: string, place: Point): Promise<void> {
		if (Settings.skipDialogs) return Promise.resolve();

		const scene = new SpeechScene(this);
		scene.text = text;
		scene.location = place;

		return this.sceneManager.presentScene(scene);
	}

	public dropItem(tile: Tile, place: Point): Promise<void> {
		console.assert(!!tile && !!place);
		const solveSector = () => {
			if (this.currentSector.findItem === tile) {
				this.currentSector.solved2 = true;
			}
		};

		if (Settings.pickupItemsAutomatically) {
			this.inventory.addItem(tile);
			solveSector();
			return Promise.resolve();
		}

		const scene = new PickupScene(this);
		scene.tile = tile;
		scene.location = place;

		return this.sceneManager.presentScene(scene).then(solveSector);
	}

	public findSectorContainingZone(zone: Zone): { sector: Sector; world: World } {
		let sector: Sector = this.world.findSectorContainingZone(zone);
		if (sector) return { sector, world: this.world };

		sector = this.dagobah.findSectorContainingZone(zone);
		if (sector) return { sector, world: this.dagobah };
	}

	public findLocationOfZone(zone: Zone): { location: Point; world: World } {
		let location: Point = this.world.findLocationOfZone(zone);
		if (location) return { location, world: this.world };

		location = this.dagobah.findLocationOfZone(zone);
		if (location) return { location, world: this.dagobah };

		return { location: null, world: null };
	}

	get hpu() {
		return this._hpu;
	}

	public set gameState(state: GameState) {
		if (state === this._gameState) return;

		this._gameState = state;
		if (this._gameState === GameState.Lost) {
			this.persistentState.gamesLost += 1;
		}
		if (this._gameState === GameState.Won) {
			const score = calculateScore(this);
			this.persistentState.gamesWon += 1;
			this.persistentState.lastScore = score;
			this.persistentState.highScore = max(
				this.persistentState.highScore,
				this.persistentState.lastScore
			);
		}
	}

	public get gameState() {
		return this._gameState;
	}
}

export default Engine;
