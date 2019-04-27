import { PaletteAnimation, Renderer } from "./rendering";
import { Tile, Zone } from "./objects";

import Camera from "./camera";
import { EventTarget } from "src/util";
import Events from "./events";
import GameData from "./game-data";
import GameState from "./game-state";
import Hero from "./hero";
import { InputManager } from "./input";
import Inventory from "./inventory";
import Metronome from "./metronome";
import { Mixer } from "./audio";
import SceneManager from "./scene-manager";
import { ScriptExecutor } from "./script";
import State from "./persistent-state";
import Story from "./story";
import { GameType as Type } from "./type";
import { World } from "./generation";
import { SpeechScene } from "src/engine/scenes";
import { Point } from "src/util";

export { Events };

class Engine extends EventTarget {
	static readonly Event = Events;

	public readonly type: Type = null;
	public mixer: Mixer<any> = null;
	public metronome: Metronome = null;
	public inputManager: InputManager = null;
	public sceneManager: SceneManager = null;
	public renderer: Renderer = null;
	public palette: PaletteAnimation = null;
	public data: GameData = null;
	public hero: Hero = null;
	public inventory: Inventory = null;
	public scriptExecutor: ScriptExecutor = null;
	public story: Story = null;
	public persistentState: typeof State = State;
	public temporaryState: any = null;
	public gameState: GameState = GameState.Stopped;
	public camera: Camera = new Camera();
	private _currentZone: Zone = null;
	private _currentWorld: World = null;
	private _updateInProgress: boolean = false;

	constructor(type: Type) {
		super();

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
			this.mixer.effectChannel.playSound(this.type.sounds.NoGo);
			return;
		}

		const healthBonus = this.type.getHealthBonus(tile);
		if (healthBonus > 0 && this.hero.health >= Hero.MAX_HEALTH) {
			this.mixer.effectChannel.playSound(this.type.sounds.NoGo);
			return;
		}
		this.hero.health += healthBonus;
		this.inventory.removeItem(tile);
		if (healthBonus < 0) {
			this.mixer.effectChannel.playSound(this.type.sounds.Hurt);
			return;
		}
	}

	public equip(tile: Tile) {
		if (!tile.isWeapon) {
			this.mixer.effectChannel.playSound(this.type.sounds.NoGo);
			return;
		}

		if (!this.type.canBeEquipped(tile)) {
			this.mixer.effectChannel.playSound(this.type.sounds.NoGo);
			return;
		}

		const weaponChar = this.data.characters.find(c => c.isWeapon && c.frames[0].extensionRight === tile);
		if (this.hero.weapon === weaponChar) return;

		this.hero.weapon = weaponChar;

		let ammo = this.hero.getAmmoForWeapon(weaponChar);
		if (!ammo) ammo = this.type.getMaxAmmo(weaponChar);
		this.hero.ammo = ammo;

		const equipSoundID = this.type.getEquipSound(weaponChar);
		this.mixer.effectChannel.playSound(equipSoundID);
	}

	public async speak(text: string, place: Point) {
		const scene = new SpeechScene(this);
		scene.text = text;
		scene.location = place;

		return this.sceneManager.presentScene(scene);
	}
}

export default Engine;
