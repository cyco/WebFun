import AbstractDrawingTool from "./abstract-drawing-tool";
import { rgba } from "src/util";
import Point from "src/util/point";
import { Tile, Zone } from "src/engine/objects";
import TileChangeEvent from "./tile-change-event";

const HighlightColor = rgba(255, 0, 0, 0.3);

class PencilTool extends AbstractDrawingTool {
	public readonly name = "Pencil";
	public readonly icon = "fa-pencil";
	public tile: Tile = null;

	activate(zone: Zone, overlay: HTMLCanvasElement): void {
		super.activate(zone, overlay);
		this._ctx.fillStyle = HighlightColor;
	}

	protected applyTo(p: Point, continous: boolean) {
		this._ctx.fillStyle = rgba(0, 255, 0, 0.3);
		this._ctx.fillRect(p.x, p.y, 1, 1);

		const point = new Point(p.x, p.y, this.layer);

		this.zone.setTile(this.tile, p);
		const event = new TileChangeEvent({affectedPoints: [point]});
		this.dispatchEvent(event);
	}

	protected drawPreview(point: Point) {
		this._ctx.fillStyle = HighlightColor;
		this._ctx.fillRect(point.x, point.y, 1, 1);
	}
}

export default PencilTool;
