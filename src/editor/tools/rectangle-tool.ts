import AbstractDrawingTool from "./abstract-drawing-tool";
import { Point } from "src/util";

class RectangleTool extends AbstractDrawingTool {
	public readonly name = "Rectangle";
	public readonly icon = "";

	protected applyTo(point: Point, continous: boolean) {
	}

	protected drawPreview(point: Point) {
	}
}

export default RectangleTool;
