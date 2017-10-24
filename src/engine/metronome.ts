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
	private _nextTick: number;
	private _tickCallback = (t: number = 0) => this._performTick(t);
	private _updatesSuspended: boolean = false;

	public ontick: Function = identity;
	public onrender: Function = identity;

	constructor() {
		this._nextTick = performance.now();
	}

	start() {
		this._stopped = false;
		this._nextTick = 0;
		this._performTick();
	}

	async _performTick(now = performance.now()) {
		if (this._stopped) return;

		this._mainLoop = window.requestAnimationFrame(this._tickCallback);
		const update = now >= this._nextTick;
		if (update) {
			this._nextTick = now + TICKLENGTH;
			if (!this._updatesSuspended) {
				await this.withSuspendedUpdates(async () => await this.ontick(1));
			}
		}
		this.onrender();

		if (update && (<any>window).onMetronomeTick instanceof Function) {
			this.withSuspendedUpdates(dispatch(async () => {
				await (<any>window).onMetronomeTick();
			}));
		}
	}

	public stop() {
		if (this._stopped) return;
		if (!this._mainLoop) return;

		this._stopped = true;
		window.cancelAnimationFrame(this._mainLoop);
		this._mainLoop = null;
	}

	public async withSuspendedUpdates<T>(thing: Function|Promise<T>) {
		console.assert(!this._updatesSuspended, "withSuspendedUpdates does not support reentry");
		this._updatesSuspended = true;

		if (thing instanceof Promise) {
			await thing;
		}

		if (thing instanceof Function) {
			await thing();
		}

		this._updatesSuspended = false;
	}
}

export default Metronome;
