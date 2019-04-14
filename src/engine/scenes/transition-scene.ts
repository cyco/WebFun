import { Tile, Zone } from "src/engine/objects";

import AbstractRenderer from "../rendering/abstract-renderer";
import { Point } from "src/util";
import Scene from "./scene";
import World from "../generation/world";
import ZoneScene from "./zone-scene";

class TransitionScene extends Scene {
	public type = -1;
	public scene: ZoneScene = null;
	public targetHeroLocation: Point = null;
	public targetZoneLocation: Point = null;
	public sourceZoneLocation: Point = null;
	public targetZone: Zone = null;
	public targetWorld: World = null;
	private state: number = Infinity;
	private _target: ImageData = null;
	private _startTime: number = Infinity;
	private _duration: number = Infinity;
	private _zoneSwapTime: number = Infinity;
	private _snapAnimationToTiles: boolean = false;

	static get TRANSITION_TYPE() {
		return {
			ZONE: 0,
			ROOM: 1
		};
	}

	willShow() {
		this._setupAnimationAttributes();
		this.state = 0;

		let offset = this.scene.currentOffset;
		// TODO: fix offset for new scene that has never been visited
		if (offset === null || offset === undefined) {
			offset = new Point(0, 0);
		}

		if (
			this.type === TransitionScene.TRANSITION_TYPE.ROOM &&
			this.engine.currentZone.sharedCounter >= 0
		) {
			this.engine.currentZone.sharedCounter &&
				console.log("copy sharedCounter", this.engine.currentZone.sharedCounter.toHex(2));
			this.targetZone.sharedCounter = this.engine.currentZone.sharedCounter;
		}

		this._startTime = performance.now();
	}

	isOpaque() {
		return true;
	}

	private _setupAnimationAttributes() {
		switch (this.type) {
			case TransitionScene.TRANSITION_TYPE.ZONE:
				this._duration = 1000.0;
				this._zoneSwapTime = this._duration;
				this._snapAnimationToTiles = false;
				break;
			case TransitionScene.TRANSITION_TYPE.ROOM:
				this._duration = 1500.0;
				this._zoneSwapTime = this._duration / 2.0;
				this._snapAnimationToTiles = true;
				break;
		}
	}

	async update(/*ticks*/) {
		if (this._zoneSwapTime !== Infinity && this.state > this._zoneSwapTime) {
			// make sure we don't swap again
			this._zoneSwapTime = Infinity;
			this._swapZones();
		}

		if (this.state >= this._duration) {
			this.engine.sceneManager.popScene();
		}
	}

	private _swapZones() {
		const state = this.engine.temporaryState;
		const hero = this.engine.hero;
		const engine = this.engine;
		hero.location = this.targetHeroLocation;
		state.worldLocation = this.targetZoneLocation || state.worldLocation;
		engine.currentWorld = this.targetWorld;
		engine.currentZone = this.targetZone;
		engine.currentZone.visited = true;

		this.scene.zone = engine.currentZone;
		this.scene.prepareCamera();

		state.justEntered = true;
		state.enteredByPlane = this.type === TransitionScene.TRANSITION_TYPE.ROOM;

		// state.dispatchEvent(Event.ZoneLocationDidChange);
	}

	render(renderer: AbstractRenderer): void {
		this.state = performance.now() - this._startTime;

		switch (this.type) {
			case TransitionScene.TRANSITION_TYPE.ZONE:
				this.state += 8;
				this._renderZoneAnimation(renderer);
				break;
			case TransitionScene.TRANSITION_TYPE.ROOM:
				this._renderRoomAnimation(renderer);
				break;
		}
	}

	private _renderZoneAnimation(_: AbstractRenderer): void {}

	private _renderRoomAnimation(renderer: AbstractRenderer): void {
		const fadeIn = this.state > this._duration / 2.0;
		const directionAdjustedState = this.state - (fadeIn ? this._duration / 2.0 : 0.0);

		let t = (directionAdjustedState / (this._duration / 2.0)) * 7;
		if (fadeIn) t = 5 - t;
		if (this._snapAnimationToTiles) t = Math.floor(t);

		const w = 9.0; // viewport width
		const h = 9.0; // viewport height

		const tileWidth = Tile.WIDTH;
		const tileHeight = Tile.HEIGHT;

		if (fadeIn) {
			this.scene.render(renderer);
		}

		renderer.fillBlackRect(0, 0, w * tileWidth, t * tileHeight);
		renderer.fillBlackRect(0, 0, t * tileWidth, h * tileHeight);
		renderer.fillBlackRect((w - t) * tileWidth, 0, t * tileWidth, h * tileHeight);
		renderer.fillBlackRect(0, (h - t) * tileHeight, h * tileWidth, t * tileHeight);
	}
}

export default TransitionScene;
