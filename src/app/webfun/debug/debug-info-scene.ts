import CanvasRenderer from "src/app/webfun/rendering/canvas/canvas-renderer";
import { Point } from "src/util";
import { Renderer } from "src/engine/rendering";
import { Scene, ZoneScene } from "src/engine/scenes";

class DebugInfoScene extends Scene {
	private _ticks = 0;
	private _fps = 0;
	private _tps = 0;
	private _lastFrame = performance.now();
	private _lastTick = performance.now();

	public render(renderer: Renderer): void {
		if (!(renderer instanceof CanvasRenderer)) return;

		this.calculateFPS();

		if (this.engine) {
			const sceneStack: Scene[] = (this.engine.sceneManager as any)._stack;
			const zoneScene = sceneStack.find(s => s instanceof ZoneScene) as ZoneScene;
			if (zoneScene) {
				renderer.renderText(`Zone ${zoneScene.zone.id.toHex(3)}`, new Point(200, 266));
			}
		}

		renderer.renderText(
			`${(this.engine.metronome as any)._tickCount[0]} ticks`,
			new Point(10, 246)
		);
		renderer.renderText(
			`${this._fps.toFixed(0)} fps, ${this._tps.toFixed(0)} tps`,
			new Point(10, 265)
		);
	}

	public async update(ticks: number): Promise<void> {
		this._ticks += ticks;
		this.calculateTPS();
	}

	private calculateTPS() {
		const now = performance.now();
		const currentTPS = 1000 / (now - this._lastTick);
		this._tps = this.smoothen(currentTPS, this._tps, 0.1);
		this._lastTick = now;
	}

	private calculateFPS() {
		const now = performance.now();
		const currentFPS = 1000 / (now - this._lastFrame);
		this._fps = this.smoothen(currentFPS, this._fps);

		this._lastFrame = now;
	}

	private smoothen(value: number, lastValue: number, weight = 0.1) {
		if (value === Infinity) return lastValue;

		return value * weight + lastValue * (1 - weight);
	}
}

export default DebugInfoScene;
