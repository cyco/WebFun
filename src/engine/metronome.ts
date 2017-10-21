import { performance } from "src/std";
import { identity } from "src/util";

const TICKLENGTH = 100;

export const Event = {
	Tick: "tick"
};

class Metronome {
	public static Event = Event;
	private _stopped: boolean = false;
	private _mainLoop: number = null;
	private _lastTick: number;
	private _nextTick: number;
	private _onTick = (t: number = 0) => this._tick(t);
	private _ticked: boolean = false;

	private ontick: Function = identity;
	private onrender: Function = identity;

	constructor() {
		this._lastTick = performance.now();
		this._nextTick = performance.now();
	}

	start() {
		this._stopped = false;
		this._tick();
	}

	async _tick(time = 0) {
		if (this._stopped) return;

		this._mainLoop = window.requestAnimationFrame(this._onTick);
		if (time === 0)
			time = performance.now();

		if (time >= this._nextTick) {
			if (this._ticked) {
				console.log("tick in progress, skipping tick");
			}

			this.ontick(1);
			this._nextTick = time + TICKLENGTH;
			this._ticked = true;
		}

		this.onrender();

		if ((<any>window).onMetronomeTick instanceof Function) {
			await (<any>window).onMetronomeTick();
		}
		this._ticked = false;
	}

	stop() {
		if (this._stopped) return;
		if (!this._mainLoop) return;

		this._stopped = true;
		window.cancelAnimationFrame(this._mainLoop);
		this._mainLoop = null;
	}
}

export default Metronome;
