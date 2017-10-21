import { Renderer } from "../engine/rendering";
import CanvasRenderer from "../engine/rendering/canvas/canvas-renderer";
import { Scene } from "../engine/scenes";
import { Point } from "../util";

class DebugInfoScene extends Scene {
	private _ticks = 0;
	private _fps = 0;
	private _lastFrame = performance.now();

	public render(renderer: Renderer): void {
		if (!(renderer instanceof CanvasRenderer)) return;

		this.calculateFPS();

		renderer.renderText(`${this._fps.toFixed(0)} fps`, new Point(10, 246));
		renderer.renderText(`${this._ticks} ticks`, new Point(10, 265));
	}

	private calculateFPS() {
		const smoothing = 0.9;
		const now = performance.now();
		const secondsSinceLastFrame = (now - this._lastFrame) / 1000;

		this._fps = (this._fps * smoothing) + (1 / secondsSinceLastFrame * (1.0 - smoothing));
		this._lastFrame = now;
	}

	public update(ticks: number): void {
		this._ticks += ticks;
	}
}

export default DebugInfoScene;
