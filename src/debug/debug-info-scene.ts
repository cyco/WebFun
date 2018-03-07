import { Renderer } from "src/engine/rendering";
import CanvasRenderer from "src/engine/rendering/canvas/canvas-renderer";
import { Scene } from "src/engine/scenes";
import { Point } from "src/util";

class DebugInfoScene extends Scene {
	private _ticks = 0;
	private _fps = 0;
	private _tps = 0;
	private _lastFrame = performance.now();
	private _lastTick = performance.now();

	public render(renderer: Renderer): void {
		if (!(renderer instanceof CanvasRenderer)) return;

		this.recalculateFPS();

		renderer.renderText(`${this._ticks} ticks`, new Point(10, 246));
		renderer.renderText(
			`${this._fps.toFixed(0)} fps, ${this._tps.toFixed(0)} tps`,
			new Point(10, 265)
		);
	}

	public async update(ticks: number): Promise<void> {
		this._ticks += ticks;
		this.recalculateTPS();
	}

	private recalculateTPS() {
		const now = performance.now();
		const currentTPS = 1000 / (now - this._lastTick);
		this._tps = this.smoothen(currentTPS, this._tps, 0.1);
		this._lastTick = now;
	}

	private recalculateFPS() {
		const now = performance.now();
		const currentFPS = 1000 / (now - this._lastFrame);
		this._fps = this.smoothen(currentFPS, this._fps);
		this._lastFrame = now;
	}

	private smoothen(value: number, lastValue: number, weight = 0.1) {
		return value * weight + lastValue * (1 - weight);
	}
}

export default DebugInfoScene;
