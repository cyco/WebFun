import { EventTarget } from "src/util";
import Story from "./story";
import PersistentState from "./persistent-state";
import GameState from "./game-state";
import Events from "./engine-events";
import Zone from "./objects/zone";

export { Events };

class Engine extends EventTarget {
	static readonly Event = Events;

	public metronome: any = null;
	public inputManager: any = null;
	public sceneManager: any = null;
	public renderer: any = null;
	public imageFactory: any = null;
	public data: any = null;
	public hero: any = null;
	public inventory: any = null;
	public scriptExecutor: any = null;
	public story: Story = null;
	public persistentState: PersistentState = null;
	public state: any = null;
	public gameState: GameState = GameState.Stopped;
	private _currentZone: Zone = null;
	private _currentWorld: any = null;

	constructor() {
		super();

		// TODO: remove state
		this.state = {
			justEntered: true,
			enteredByPlane: true,
			bump: false
		};
		this.persistentState = <PersistentState>{
			gamesWon: 0
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
		this.dispatchEvent(Events.LocationChanged, {zone: z, world: this._currentWorld});
	}

	get currentWorld() {
		return this._currentWorld;
	}

	set currentWorld(w) {
		this._currentWorld = w;
	}

	update(ticks: number) {
		this.sceneManager.update(ticks);
	}

	render() {
		this.sceneManager.render(this.renderer);
	}

	// TODO: remove calls and method
	setCursor(cursor: any) {
	}
}

export default Engine;
