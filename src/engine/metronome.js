import { cancelAnimationFrame, performance, requestAnimationFrame } from "/std";
import { identity } from "/util";

const TICKLENGTH = 100;

export default class {
	constructor() {
		this._stopped = true;
		this._mainLoop = null;

		this._lastTick = performance.now();
		this._nextTick = performance.now();

		this.ontick = identity;
		this.onrender = identity;
	}

	start() {
		this._stopped = false;
		this._tick();
	}

	_tick(time = 0) {
		if (this._stopped) return;

		this._mainLoop = requestAnimationFrame(this._tick.bind(this));
		if (time === 0)
			time = performance.now();

		if (time >= this._nextTick) {
			this.ontick(1);
			this._nextTick = time + TICKLENGTH;
		}
		this.onrender();
	}

	stop() {
		if (this._stopped) return;
		if (!this._mainLoop) return;

		this._stopped = true;
		cancelAnimationFrame(this._mainLoop);
		this._mainLoop = null;
	}
}
