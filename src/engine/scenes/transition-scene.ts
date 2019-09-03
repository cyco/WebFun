import { Tile, Zone } from "src/engine/objects";

import { Renderer } from "../rendering";
import { Point } from "src/util";
import Scene from "./scene";
import World from "../generation/world";
import ZoneScene from "./zone-scene";
import Settings from "src/settings";
import { drawZoneImageData } from "src/app/rendering";
import { min } from "src/std/math";

export enum TransitionType {
	Zone,
	Room
}

class TransitionScene extends Scene {
	public static readonly Type = TransitionType;
	public type: TransitionType = TransitionType.Room;
	public scene: ZoneScene = null;
	public destinationHeroLocation: Point = null;
	public destinationZoneLocation: Point = null;
	public originZoneLocation: Point = null;
	public destinationZone: Zone = null;
	public destinationWorld: World = null;
	private state: number = Infinity;
	private _startTime: number = Infinity;
	private _duration: number = Infinity;
	private _zoneSwapTime: number = Infinity;
	private _snapAnimationToTiles: boolean = false;
	private _direction: Point;
	private _originImage: ImageData;
	private _destinationImage: ImageData;

	willShow() {
		if (this.type === TransitionScene.Type.Room && this.engine.currentZone.sharedCounter >= 0) {
			this.destinationZone.sharedCounter = this.engine.currentZone.sharedCounter;
		}

		this._setupAnimationAttributes();
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
		this._direction = null;
		this._originImage = null;
		this._destinationImage = null;
	}

	isOpaque() {
		return true;
	}

	private _setupAnimationAttributes() {
		switch (this.type) {
			case TransitionScene.Type.Zone:
				this._duration = 1000.0;
				this._zoneSwapTime = this._duration;
				this._snapAnimationToTiles = false;
				break;
			case TransitionScene.Type.Room:
				this._duration = 1500.0;
				this._zoneSwapTime = this._duration / 2.0;
				this._snapAnimationToTiles = true;
				break;
		}
	}

	async update(/*ticks*/) {
		if (Settings.skipTransitions) {
			this._zoneSwapTime = Infinity;
			this._swapZones();
			this._duration = 0;
		}

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
		hero.location = this.destinationHeroLocation;
		state.worldLocation = this.destinationZoneLocation || state.worldLocation;
		engine.currentWorld = this.destinationWorld;
		engine.currentZone = this.destinationZone;
		engine.currentZone.visited = true;
		engine.currentZone.initialize();

		this.scene.zone = engine.currentZone;
		this.scene.prepareCamera();

		state.justEntered = true;
		state.enteredByPlane = this.type === TransitionScene.Type.Room;

		// state.dispatchEvent(Event.ZoneLocationDidChange);
	}

	render(renderer: Renderer): void {
		this.state = performance.now() - this._startTime;

		switch (this.type) {
			case TransitionScene.Type.Zone:
				this._renderZoneAnimation(renderer);
				break;
			case TransitionScene.Type.Room:
				this._renderRoomAnimation(renderer);
				break;
		}
	}

	private _renderZoneAnimation(renderer: Renderer): void {
		if (!this._direction) {
			this._direction = this.originZoneLocation.bySubtracting(this.destinationZoneLocation);
			this._originImage = drawZoneImageData(this.engine.currentZone, this.engine.palette.current);
			this._destinationImage = drawZoneImageData(this.destinationZone, this.engine.palette.current);
		}

		const camera = this.engine.camera;
		const animationState = min(this.state / this._duration, 1);
		const cameraOffset = camera.offset.byScalingBy(Tile.WIDTH);
		const viewportWidth = Tile.WIDTH * 9;
		const viewportHeight = Tile.HEIGHT * 9;

		renderer.renderImageData(
			this._originImage,
			cameraOffset.x + this._direction.x * viewportWidth * animationState,
			cameraOffset.y + this._direction.y * viewportHeight * animationState
		);
		renderer.renderImageData(
			this._destinationImage,
			cameraOffset.x + this._direction.x * viewportWidth * (animationState - 2),
			cameraOffset.y + this._direction.y * viewportHeight * (animationState - 2)
		);
	}

	private _renderRoomAnimation(renderer: Renderer): void {
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
