import { Renderer } from "../engine/rendering";
import CanvasRenderer from "../engine/rendering/canvas/canvas-renderer";
import { Scene } from "../engine/scenes";
import { Point } from "../util";

class DebugInfoScene extends Scene {
	private _ticks = 0;
	private readonly _ticksLocation = new Point(10, 10);

	public render(renderer: Renderer): void {
		if (!(renderer instanceof CanvasRenderer)) return;

		renderer.renderText(`Ticks: ${this._ticks}`, this._ticksLocation);
	}

	public update(ticks: number): void {
		this._ticks += ticks;
	}
}

export default DebugInfoScene;
