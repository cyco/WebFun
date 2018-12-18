import { EventTarget } from "src/util";
import Events from "./events";
import GameState from "./game-state";
import { World } from "./generation";
import Hero from "./hero";
import { InputManager } from "./input";
import Inventory from "./inventory";
import Metronome from "./metronome";
import { Zone, Tile } from "./objects";
import State from "./persistent-state";
import { AbstractImageFactory, Renderer } from "./rendering";
import SceneManager from "./scene-manager";
import { ScriptExecutor } from "./script";
import Story from "./story";
import GameData from "./game-data";
import { GameType as Type } from "./type";
import { Mixer } from "./audio";
import Camera from "./camera";

export { Events };

class Engine extends EventTarget {
	static readonly Event = Events;

	public readonly type: Type = null;
	public mixer: Mixer<any> = null;
	public metronome: Metronome = null;
	public inputManager: InputManager = null;
	public sceneManager: SceneManager = null;
	public renderer: Renderer = null;
	public imageFactory: AbstractImageFactory = null;
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
		return this.sceneManager.update(ticks);
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
}

export default Engine;
