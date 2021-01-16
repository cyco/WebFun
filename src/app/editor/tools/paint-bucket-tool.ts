import { Point, rgba } from "src/util";

import AbstractDrawingTool from "./abstract-drawing-tool";
import TileChangeEvent from "src/app/editor/tools/tile-change-event";

const HighlightColor = rgba(255, 0, 0, 0.3);

class PaintBucketTool extends AbstractDrawingTool {
	public readonly name = "Paint Bucket";
	public readonly icon = "";
	public readonly shortcut = { keyCode: 71 };

	protected applyTo(point: Point, continuous: boolean): void {
		if (continuous) return;
		if (this.layer.locked) return;
		if (!this.zone.bounds.contains(point)) return;

		const points = this.findConnectedPoints(point);
		points.forEach(p => {
			this.zone.setTile(this.tile, p);
		});

		const event = new TileChangeEvent({ affectedPoints: points });
		this.dispatchEvent(event);
	}

	protected drawPreview(point: Point): void {
		this._ctx.fillStyle = HighlightColor;
		this.findConnectedPoints(point).forEach(p => {
			this._ctx.fillRect(p.x, p.y, 1, 1);
		});
	}

	private findConnectedPoints(point: Point): Point[] {
		const layer = this.layer.id;
		const tile = this.zone.getTile(point.x, point.y, layer);
		const graphs: Set<Point>[] = [];
		const graph = new Set<Point>([new Point(point.x, point.y, layer)]);

		for (let y = 0; y < this.zone.size.height; y++) {
			for (let x = 0; x < this.zone.size.width; x++) {
				if (x === point.x && y === point.y) continue;
				if (this.zone.getTile(x, y, layer) !== tile) continue;

				graphs.push(
					new Set<Point>([new Point(x, y, layer)])
				);
			}
		}

		const connected = (g1: Set<Point>, g2: Set<Point>) => {
			return g1.some((point1: Point) =>
				g2.some((point2: Point) => point1.distanceTo(point2) === 1)
			);
		};

		while (true) {
			const index = graphs.findIndex(value => connected(graph, value));
			if (index === -1) return [...graph.values()];

			const newSubgraph = graphs.splice(index, 1)[0];
			newSubgraph.forEach(point => graph.add(point));
		}
	}
}

export default PaintBucketTool;
