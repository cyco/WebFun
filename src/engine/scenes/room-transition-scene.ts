import TransitionScene from "./transition-scene";
import { Tile } from "../objects";
import { Renderer } from "../rendering";

class RoomTransitionScene extends TransitionScene {
	private _snapAnimationToTiles: boolean = true;

	public willShow(): void {
		this._duration = 1500.0;
		this._zoneSwapTime = this._duration / 2.0;

		if (this.engine.currentZone.sharedCounter >= 0) {
			this.destinationZone.sharedCounter = this.engine.currentZone.sharedCounter;
		}

		super.willShow();
	}

	protected swapZones(): void {
		this.engine.temporaryState.enteredByPlane = true;
		super.swapZones();
	}

	protected renderState(renderer: Renderer, state: number): void {
		const fadeIn = state > this._duration / 2.0;
		const directionAdjustedState = state - (fadeIn ? this._duration / 2.0 : 0.0);

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

export default RoomTransitionScene;
