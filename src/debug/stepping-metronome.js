import { EventTarget } from "/util";

export const Event = {
	StatusChange: 'statuschange'
};

export const Status = {
	Paused: 'paused',
	Running: 'running'
};

export default class extends EventTarget {
	static get Event() {
		return Event;
	}

	constructor(metronome) {
		super();

		this._metronome = metronome;
		this.registerEvents(Event);
	}

	get status() {
		return this._metronome._stopped ? Status.Paused : Status.Running;
	}

	redraw() {
		this._metronome.onrender();
	}

	step() {
		this._metronome.ontick();
	}

	start() {
		this._metronome.start();
		this.dispatchEvent(Event.StatusChange);
	}

	stop() {
		this._metronome.stop();
		this.dispatchEvent(Event.StatusChange);
	}

	set ontick(cb) {
		this._metronome.ontick = cb;
	}

	set onrender(cb) {
		this._metronome.onrender = cb;
	}

	get ontick() {
		return this._metronome.ontick;
	}

	get onrender() {
		return this._metronome.onrender;
	}
}
