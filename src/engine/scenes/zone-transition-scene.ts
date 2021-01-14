import TransitionScene from "./transition-scene";
import { min } from "src/std/math";
import { Tile } from "../objects";
import { drawZoneImageData } from "src/app/webfun/rendering";
import { Renderer } from "../rendering";
import { Point } from "src/util";

class ZoneTransitionScene extends TransitionScene {
	private _direction: Point;
	private _originImage: ImageData;
	private _destinationImage: ImageData;

	public willShow(): void {
		this._duration = 1000.0;
		this._zoneSwapTime = this._duration;

		super.willShow();
	}

	public didHide(): void {
		super.didHide();

		this._direction = null;
		this._originImage = null;
		this._destinationImage = null;
	}

	protected renderState(renderer: Renderer, state: number): void {
		if (!this._direction) {
			this._direction = this.originZoneLocation.bySubtracting(this.destinationZoneLocation);
			this._originImage = drawZoneImageData(this.engine.currentZone, this.engine.palette.current);
			this._destinationImage = drawZoneImageData(this.destinationZone, this.engine.palette.current);
		}

		const camera = this.engine.camera;
		const animationState = min(state / this._duration, 1);
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
}

export default ZoneTransitionScene;
