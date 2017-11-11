import AbstractTool from "./abstract-tool";
import { Zone } from "src/engine/objects";
import { HEIGHT as TileHeight, WIDTH as TileWidth } from "src/engine/objects/tile";
import { Point, rgba } from "src/util";

class NoTool extends AbstractTool {
	private _currentTile: Point = new Point(-1, -1);
	protected highlightColor: string = rgba(255, 0, 0, 0.3);
	protected mouseMoveHandler = (event: MouseEvent) => this._mouseMoved(event);

	public activate(zone: Zone, overlay: HTMLCanvasElement): void {
		super.activate(zone, overlay);

		this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
		this.canvas.addEventListener("mouseenter", this.mouseMoveHandler);
		this.canvas.addEventListener("mouveleave", this.mouseMoveHandler);
	}

	public deactivate(): void {
		this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
		this.canvas.removeEventListener("mouseenter", this.mouseMoveHandler);
		this.canvas.removeEventListener("mouveleave", this.mouseMoveHandler);

		super.deactivate();
	}

	_mouseMoved(event: MouseEvent): void {
		const tilePoint = new Point(Math.floor(event.offsetX / TileWidth), Math.floor(event.offsetY / TileHeight));

		if (this._currentTile.isEqualTo(tilePoint)) return;
		this._currentTile = tilePoint;

		const zone = this.zone;
		const ctx = this.canvas.getContext("2d");
		ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
		ctx.clearRect(0, 0, zone.size.width * TileWidth, zone.size.height * TileHeight);

		if (tilePoint.x < 0 || tilePoint.y < 0 || tilePoint.x >= zone.size.width || tilePoint.y >= zone.size.height) return;

		ctx.fillStyle = this.highlightColor;
		ctx.fillRect(tilePoint.x * TileWidth, tilePoint.y * TileHeight, TileWidth, TileHeight);
	}
}

export default NoTool;
