import { EventTarget } from '/util';

export const Event = {
	CurrentZoneChange: 'currentZoneChange'
};

export default class extends EventTarget {
	static get Event() {
		return Event;
	}

	constructor() {
		super();

		this.metronome = null;
		this.sceneManager = null;
		this.renderer = null;
		this.imageFactory = null;
		this.data = null;
		this.hero = null;
		this._currentZone = null;
		this.inventory = null;

		this.story = null;

		// TODO: remove state
		this.state = {
			justEntered: true
		};

		this.registerEvent(Event);
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
