import { Point, Rectangle, Size, rgba } from "src/util";

import AbstractDrawingTool from "./abstract-drawing-tool";
import TileChangeEvent from "./tile-change-event";

const HighlightColor = rgba(255, 0, 0, 0.3);

class RectangleTool extends AbstractDrawingTool {
	public readonly name = "Rectangle";
	public readonly icon = "icon-unknown-2";
	public readonly shortcut = { keyCode: 85 };
	private _startingPoint: Point = null;

	protected applyTo(point: Point, _: boolean) {
		if (!this.zone.bounds.contains(point)) return;
		if (!this._startingPoint) this._startingPoint = point;

		const rect = this.calculateRectFromStartTo(point);

		this._ctx.fillStyle = HighlightColor;
		this._ctx.fillRect(rect.minX, rect.minY, rect.size.width, rect.size.height);
	}

	protected finalize(point: Point) {
		if (this.layer.locked) {
			this._startingPoint = null;
			return;
		}
		const rect = this.calculateRectFromStartTo(point);
		const layer = this.layer.id;
		const points: Point[] = [];
		for (let y = rect.minY; y < rect.maxY; y++) {
			for (let x = rect.minX; x < rect.maxX; x++) {
				const point = new Point(x, y, layer);
				this.zone.setTile(this.tile, point);
				points.push(point);
			}
		}
		const event = new TileChangeEvent({ affectedPoints: points });
		this.dispatchEvent(event);
		this._startingPoint = null;
	}

	protected drawPreview(point: Point) {
		this._startingPoint = point;

		this._ctx.fillStyle = HighlightColor;
		this._ctx.fillRect(point.x, point.y, 1, 1);
	}

	private calculateRectFromStartTo(point: Point): Rectangle {
		const min = new Point(
			Math.min(point.x, this._startingPoint.x),
			Math.min(point.y, this._startingPoint.y)
		);
		const max = new Point(
			Math.max(point.x, this._startingPoint.x),
			Math.max(point.y, this._startingPoint.y)
		);

		return new Rectangle(min, new Size(max.x - min.x + 1, max.y - min.y + 1));
	}
}

export default RectangleTool;
