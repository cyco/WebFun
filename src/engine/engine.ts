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
import { ScriptExecutor } from "./script";
import State from "./persistent-state";
import Story from "./story";
import { GameType as Type } from "./type";
import { World } from "./generation";
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

export { Events };

class Engine extends EventTarget {
	static readonly Event = Events;

	public readonly type: Type = null;
	public assetManager: AssetManager = null;
	public resourceManager: ResourceManager = null;
	public camera: Camera = new Camera();
	public gameState: GameState = GameState.Stopped;
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
	public scriptExecutor: ScriptExecutor = null;
	public story: Story = null;
	public temporaryState: any = null;
	private _currentWorld: World = null;
	private _currentZone: Zone = null;
	private _updateInProgress: boolean = false;

	constructor(type: Type, ifce: Partial<Interface> = {}) {
		super();

		ifce = Object.assign({}, DummyInterface, ifce) as Interface;

		this.mixer = ifce.Mixer();

		this.resourceManager = ifce.ResourceManager();
		this.assetManager = ifce.AssetManager();
		this.renderer = ifce.Renderer(null);
		this.sceneManager = ifce.SceneManager();
		this.inputManager = ifce.InputManager(null);
		this.metronome = ifce.Metronome();
		this.inventory = ifce.Inventory();
		this.scriptExecutor = ifce.ScriptExecutor(this, Instructions, Conditions);
		this.hero = ifce.Hero();
		this.loader = ifce.Loader(this);

		this.type = type;
		// TODO: remove state
		this.temporaryState = {
			justEntered: true,
			enteredByPlane: true,
			bump: false
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

	public consume(tile: Tile) {
		if (!tile.isEdible) {
			const sound = this.assetManager.get(Sound, this.type.sounds.NoGo, NullIfMissing);
			this.mixer.play(sound, Channel.Effect);
			return;
		}

		const healthBonus = this.type.getHealthBonus(tile);
		if (healthBonus > 0 && this.hero.health >= Hero.MaxHealth) {
			const sound = this.assetManager.get(Sound, this.type.sounds.NoGo, NullIfMissing);
			this.mixer.play(sound, Channel.Effect);
			return;
		}
		this.hero.health += healthBonus;
		this.inventory.removeItem(tile);
		if (healthBonus < 0) {
			const sound = this.assetManager.get(Sound, this.type.sounds.Hurt, NullIfMissing);
			this.mixer.play(sound, Channel.Effect);
			return;
		}
	}

	public equip(tile: Tile) {
		if (!tile.isWeapon) {
			const sound = this.assetManager.get(Sound, this.type.sounds.NoGo, NullIfMissing);
			this.mixer.play(sound, Channel.Effect);
			return;
		}

		if (!this.type.canBeEquipped(tile)) {
			const sound = this.assetManager.get(Sound, this.type.sounds.NoGo, NullIfMissing);
			this.mixer.play(sound, Channel.Effect);
			return;
		}

		const weaponChar = this.assetManager.find(
			Char,
			c => c.isWeapon && c.frames[0].extensionRight === tile
		);
		if (this.hero.weapon === weaponChar) return;

		this.hero.weapon = weaponChar;

		let ammo = this.hero.getAmmoForWeapon(weaponChar);
		if (!ammo) ammo = this.type.getMaxAmmo(weaponChar);
		this.hero.ammo = ammo;

		const equipSoundID = this.type.getEquipSound(weaponChar);
		const sound = this.assetManager.get(Sound, equipSoundID, NullIfMissing);
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
		if (Settings.pickupItemsAutomatically) {
			this.inventory.addItem(tile);
			return Promise.resolve();
		}

		const scene = new PickupScene(this);
		scene.tile = tile;
		scene.location = place;

		return this.sceneManager.presentScene(scene);
	}
}

export default Engine;
