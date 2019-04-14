import { dispatch, identity } from "src/util";

import { performance } from "src/std";

const TICKLENGTH = 100;

export const Event = {
	BeforeTick: "beforeTick",
	Tick: "tick",
	AfterTick: "afterTick"
};

class Metronome {
	public static Event = Event;
	public ontick: Function = identity;
	public onbeforetick: Function = identity;
	public onaftertick: Function = identity;
	public onrender: Function = identity;
	private _stopped: boolean = false;
	private _mainLoop: number = null;
	private _nextTick: number;
	private _tickCallback = (t: number = 0) => this._performTick(t);
	private _updatesSuspended: boolean = false;

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
				await this.withSuspendedUpdates(async () => {
					await this.onbeforetick(1);
					await this.ontick(1);
					await this.onaftertick(1);
				});
			}
		}

		this.onrender();

		if (update && (window as any).onMetronomeTick instanceof Function) {
			this.withSuspendedUpdates(dispatch(async () => await (window as any).onMetronomeTick()));
		}
	}

	public stop() {
		if (this._stopped) return;
		if (!this._mainLoop) return;

		this._stopped = true;
		window.cancelAnimationFrame(this._mainLoop);
		this._mainLoop = null;
	}

	public async withSuspendedUpdates<T>(thing: Function | Promise<T>) {
		console.assert(!this._updatesSuspended, "withSuspendedUpdates does not support reentry");
		this._updatesSuspended = true;
		try {
			if (thing instanceof Promise) {
				await thing;
			}

			if (thing instanceof Function) {
				await thing();
			}
		} catch (e) {
		} finally {
			this._updatesSuspended = false;
		}
	}
}

export default Metronome;
