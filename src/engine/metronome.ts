import { dispatch, identity, EventTarget } from "src/util";

import { performance } from "src/std";

export const DefaultTickDuration = 100;

export const Event = {
	BeforeTick: "beforeTick",
	Tick: "tick",
	AfterTick: "afterTick",

	BeforeRender: "BeforeRender",
	Render: "Render",
	AfterRender: "AfterRender"
};

class MetronomeEvent extends CustomEvent<void> {}

class Metronome extends EventTarget {
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
	private _tickDuration = DefaultTickDuration;

	constructor() {
		super();
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
			this._nextTick = now + this._tickDuration;
			if (!this._updatesSuspended) {
				await this.withSuspendedUpdates(async () => {
					await this.onbeforetick(1);
					this.dispatchEvent(new MetronomeEvent(Event.BeforeTick));
					await this.ontick(1);
					this.dispatchEvent(new MetronomeEvent(Event.Tick));
					await this.onaftertick(1);
					this.dispatchEvent(new MetronomeEvent(Event.AfterTick));
				});
			}
		}

		this.dispatchEvent(new MetronomeEvent(Event.BeforeRender));
		this.onrender();
		this.dispatchEvent(new MetronomeEvent(Event.Render));
		this.dispatchEvent(new MetronomeEvent(Event.AfterRender));

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

	public set tickDuration(t: number) {
		this._tickDuration = t;
	}

	public get tickDuration() {
		return this._tickDuration;
	}
}

export default Metronome;
