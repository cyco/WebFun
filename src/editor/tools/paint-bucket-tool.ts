import AbstractDrawingTool from "./abstract-drawing-tool";
import { Point } from "src/util";

class PaintBucketTool extends AbstractDrawingTool {
	public readonly name = "Paint Bucket";
	public readonly icon = "";


	protected applyTo(point: Point, continous: boolean) {

	}

	protected drawPreview(point: Point) {

	}
}

export default PaintBucketTool;
