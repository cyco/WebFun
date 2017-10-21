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

	private ontick: Function = identity;
	private onrender: Function = identity;

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
		const updated = now >= this._nextTick && this._performUpdate(now);
		this.onrender();

		if (updated && (<any>window).onMetronomeTick instanceof Function) {
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

	private _performUpdate(now: number): boolean {
		this._nextTick = now + TICKLENGTH;
		if (this._updatesSuspended) return false;
		this.ontick(1);
		return true;
	}
}

export default Metronome;
