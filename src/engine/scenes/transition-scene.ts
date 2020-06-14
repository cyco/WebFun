import { Zone } from "src/engine/objects";

import { Renderer } from "../rendering";
import { Point } from "src/util";
import Scene from "./scene";
import World from "src/engine/world";
import ZoneScene from "./zone-scene";
import Settings from "src/settings";

abstract class TransitionScene extends Scene {
	public scene: ZoneScene = null;
	public destinationHeroLocation: Point = null;
	public destinationZoneLocation: Point = null;
	public originZoneLocation: Point = null;
	public destinationZone: Zone = null;
	public destinationWorld: World = null;
	private state: number = Infinity;
	private _startTime: number = Infinity;
	protected _duration: number = Infinity;
	protected _zoneSwapTime: number = Infinity;

	willShow() {
		this.state = 0;
		this._startTime = performance.now();
	}

	didHide() {
		this.scene = null;
		this.destinationHeroLocation = null;
		this.destinationZoneLocation = null;
		this.originZoneLocation = null;
		this.destinationZone = null;
		this.destinationWorld = null;
	}

	isOpaque() {
		return false;
	}

	async update(/*ticks*/) {
		if (Settings.skipTransitions) {
			this._zoneSwapTime = Infinity;
			this.swapZones();
			this._duration = 0;
		}

		if (this._zoneSwapTime !== Infinity && this.state >= this._zoneSwapTime) {
			// make sure we don't swap again
			this._zoneSwapTime = Infinity;
			this.swapZones();
		}

		if (this.state >= this._duration) {
			this.engine.sceneManager.popScene();
		}
	}

	protected swapZones() {
		const state = this.engine.temporaryState;
		const hero = this.engine.hero;
		const engine = this.engine;
		hero.location = this.destinationHeroLocation;
		engine.currentWorld = this.destinationWorld;
		engine.currentZone = this.destinationZone;
		engine.currentZone.visited = true;
		engine.currentZone.initialize();

		this.scene.zone = engine.currentZone;
		this.scene.prepareCamera();

		state.justEntered = true;
		// state.dispatchEvent(Event.ZoneLocationDidChange);
	}

	render(renderer: Renderer): void {
		this.state = performance.now() - this._startTime;
		this.renderState(renderer, this.state);
	}

	protected abstract renderState(renderer: Renderer, state: number): void;
}

export default TransitionScene;
