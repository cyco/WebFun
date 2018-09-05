import { EventTarget } from "src/util";
import Events from "./events";
import GameState from "./game-state";
import { World } from "./generation";
import Hero from "./hero";
import { InputManager } from "./input";
import Inventory from "./inventory";
import Metronome from "./metronome";
import { Zone } from "./objects";
import State from "./persistent-state";
import { AbstractImageFactory, Renderer } from "./rendering";
import SceneManager from "./scene-manager";
import { ScriptExecutor } from "./script";
import Story from "./story";
import GameData from "./game-data";

export { Events };

class Engine extends EventTarget {
	static readonly Event = Events;

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
	private _currentZone: Zone = null;
	private _currentWorld: World = null;

	constructor() {
		super();

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
}

export default Engine;
