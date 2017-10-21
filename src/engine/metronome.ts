import { performance } from "src/std";
import { identity } from "src/util";
import dispatch from "src/util/dispatch";

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

		let ticked = false;
		if (time >= this._nextTick) {
			this.ontick(1);
			this._nextTick = time + TICKLENGTH;
			ticked = true;
		}

		this.onrender();

		if (ticked && (<any>window).onMetronomeTick instanceof Function) {
			window.cancelAnimationFrame(this._mainLoop);
			dispatch(async () => {
				await(<any>window).onMetronomeTick();
				this._mainLoop = window.requestAnimationFrame(this._onTick);
			});
		}
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
