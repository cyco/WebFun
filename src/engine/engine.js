import { EventTarget } from '/util';

export const Event = {
	CurrentZoneChange: 'currentzonechange'
};

export default class extends EventTarget {
	static get Event() {
		return Event;
	}

	constructor() {
		super();

		this.metronome = null;
		this.inputManager = null;
		this.sceneManager = null;
		this.renderer = null;
		this.imageFactory = null;
		this.data = null;
		this.hero = null;
		this._currentZone = null;
		this.inventory = null;
		this.scriptExecutor = null;
		
		this.story = null;

		// TODO: remove state
		this.state = {
			justEntered: true,
			enteredByPlane: true,
			bump: false
		};
		this.persistentState = {
			gamesWon: 0
		};

		this.registerEvents(Event);
		Object.seal(this);
	}

	update(ticks) {
		this.sceneManager.update(ticks);
	}

	render() {
		this.sceneManager.render(this.renderer);
	}

	// TODO: remove calls and method
	setCursor() {}

	get dagobah() {
		return this.story.dagobah;
	}
	get world() {
		return this.story.world;
	}

	set currentZone(z) {
		this._currentZone = z;
		this.dispatchEvent(Event.CurrentZoneChange);
	}

	get currentZone() {
		return this._currentZone;
	}
}
