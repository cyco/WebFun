import { dispatch, identity, EventTarget } from "src/util";

import { performance } from "src/std";

export const DefaultTickDuration = 100;

export const Event = {
	BeforeTick: "beforeTick",
	AfterTick: "afterTick",

	BeforeRender: "BeforeRender",
	Render: "Render",
	AfterRender: "AfterRender"
};

class MetronomeEvent extends CustomEvent<void> {}

const MinimumFrameDuration = 1000 / 60;

class Metronome extends EventTarget {
	public static Event = Event;
	public ontick: Function = identity;
	public onrender: Function = identity;
	private _stopped: boolean = false;
	private _mainLoop: number = 0;
	private _updateLoop: number = 0;
	private _nextTick: number = 0;
	private _tickCallback = (t: number = 0) => this._executeRenderAndUpdateLoop(t);
	private _renderCallback = () => this._executeRenderLoop();
	private _updatesSuspended: boolean = false;
	private _tickDuration = DefaultTickDuration;

	constructor() {
		super();
		this._nextTick = performance.now();
	}

	start() {
		this._stopped = false;
		this._nextTick = 0;

		if (this.tickDuration < MinimumFrameDuration) {
			this._executeUpdateLoop();
			this._executeRenderLoop();
		} else {
			this._executeRenderAndUpdateLoop();
		}
	}

	private _executeUpdateLoop() {
		if (this._stopped) return;
		this._updateLoop = setTimeout(() => this._executeUpdateLoop(), this.tickDuration);
		this.update();
	}

	private _executeRenderLoop() {
		if (this._stopped) return;
		this._mainLoop = window.requestAnimationFrame(this._renderCallback);
		this.onrender();
	}

	async _executeRenderAndUpdateLoop(now = performance.now()) {
		if (this._stopped) return;

		this._mainLoop = window.requestAnimationFrame(this._tickCallback);
		const update = now >= this._nextTick;
		if (update) await this.update(now);

		await this.onrender();

		if (update && (window as any).onMetronomeTick instanceof Function) {
			this.withSuspendedUpdates(dispatch(async () => await (window as any).onMetronomeTick()));
		}
	}

	private async update(now = performance.now()) {
		this._nextTick = now + this._tickDuration;

		if (!this._updatesSuspended) {
			await this.withSuspendedUpdates(async () => {
				this.dispatchEvent(new MetronomeEvent(Event.BeforeTick));
				await this.ontick(1);
				this.dispatchEvent(new MetronomeEvent(Event.AfterTick));
			});
		}
	}

	public stop() {
		if (this._stopped) return;
		if (!this._mainLoop) return;

		this._stopped = true;
		window.cancelAnimationFrame(this._mainLoop);
		window.clearTimeout(this._updateLoop);
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
