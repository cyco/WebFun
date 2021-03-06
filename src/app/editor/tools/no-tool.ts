import { Tile, Zone } from "src/engine/objects";

import AbstractTool from "./abstract-tool";
import { Point } from "src/util";

class NoTool extends AbstractTool implements EventListenerObject {
	public readonly name = "None";
	public readonly icon = "";
	private _ctx: CanvasRenderingContext2D;

	public activate(zone: Zone, overlay: HTMLCanvasElement): void {
		super.activate(zone, overlay);

		this.canvas.addEventListener("mousemove", this);
		this.canvas.addEventListener("mouseenter", this);
		this.canvas.addEventListener("mouseleave", this);

		this._ctx = overlay.getContext("2d");
		this._ctx.save();
		this._ctx.globalCompositeOperation = "source-over";
		this._ctx.textAlign = "left";
		this._ctx.shadowColor = "black";
		this._ctx.shadowBlur = 1;
		this._ctx.shadowOffsetX = 0;
		this._ctx.shadowOffsetY = 1;
		this._ctx.font = `${13 * window.devicePixelRatio}px \"Anonymous Pro\", monospace`;
		this._ctx.fillStyle = "white";
	}

	public handleEvent(e: MouseEvent): void {
		const tilePoint = this.extractTileCoordinates(e);
		if (!tilePoint) return;

		this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		const position = `${tilePoint.x}x${tilePoint.y}`;
		this.renderText(position, new Point(10, 10));

		[
			this.zone.getTile(tilePoint.x, tilePoint.y, 2),
			this.zone.getTile(tilePoint.x, tilePoint.y, 1),
			this.zone.getTile(tilePoint.x, tilePoint.y, 0)
		].forEach((t, idx) => {
			const layer = Zone.Layer[idx];
			this.renderText(`${layer}: ` + (t ? `${t.id}` : ""), new Point(20, 40 + 20 * idx));
		});
	}

	private renderText(text: string, location: Point) {
		this._ctx.fillText(text, location.x, location.y + 13 / 2);
	}

	protected extractTileCoordinates(event: MouseEvent): Point {
		const zone = this.zone;

		const offset = event.offsetIn(this.canvas);
		const point = offset.scaleBy(1 / Tile.WIDTH).floor();
		if (point.x < 0 || point.y < 0 || point.x >= zone.size.width || point.y >= zone.size.height)
			return null;

		return point;
	}

	public deactivate(): void {
		this.canvas.removeEventListener("mousemove", this);
		this.canvas.removeEventListener("mouseenter", this);
		this.canvas.removeEventListener("mouseleave", this);

		this._ctx.restore();
		this._ctx = null;

		super.deactivate();
	}
}

export default NoTool;
