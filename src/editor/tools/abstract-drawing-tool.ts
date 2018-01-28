import AbstractTool from "src/editor/tools/abstract-tool";
import { Zone } from "src/engine/objects";
import Tile, { HEIGHT as TileHeight, WIDTH as TileWidth } from "src/engine/objects/tile";
import { Point } from "src/util";

abstract class AbstractDrawingTool extends AbstractTool implements EventListenerObject {
	protected _ctx: CanvasRenderingContext2D;
	protected _currentTile: Point = new Point(-1, -1);
	protected _tile: Tile;
	private _isApplying: boolean = false;

	public activate(zone: Zone, overlay: HTMLCanvasElement): void {
		super.activate(zone, overlay);

		this._ctx = overlay.getContext("2d");
		this._ctx.save();
		this._ctx.setTransform(window.devicePixelRatio * TileWidth, 0, 0, window.devicePixelRatio * TileHeight, 0, 0);

		this.canvas.addEventListener("mousedown", this);
		this.canvas.addEventListener("mousemove", this);
		this.canvas.addEventListener("mouseenter", this);
		this.canvas.addEventListener("mouveleave", this);
	}

	public deactivate(): void {
		if (this.zone) {
			this._ctx.clearRect(0, 0, this.zone.size.width, this.zone.size.height);
		}
		this._ctx.restore();

		this.canvas.removeEventListener("mousedown", this);
		this.canvas.removeEventListener("mousemove", this);
		this.canvas.removeEventListener("mouseenter", this);
		this.canvas.removeEventListener("mouveleave", this);

		document.removeEventListener("mousemove", this);
		document.removeEventListener("mouseup", this);

		this._isApplying = false;

		super.deactivate();
	}

	private _drawPreview(point: Point) {
		this._ctx.clearRect(0, 0, this.zone.size.width, this.zone.size.height);
		this.drawPreview(point);
	}

	private _applyTo(point: Point, continous: boolean) {
		this._ctx.clearRect(0, 0, this.zone.size.width, this.zone.size.height);
		this.applyTo(point, continous);
	}

	protected abstract drawPreview(point: Point): void;

	protected abstract applyTo(point: Point, continous: boolean): void;

	protected finalize(point: Point): void {}

	public handleEvent(event: MouseEvent): void {
		if (event.type === "mouseup") {
			this._mouseReleased(event);
			return;
		}

		if (event.type === "mousedown") {
			this._mousePressed(event);
			return;
		}

		this._mouseMoved(event);
	}

	protected _mousePressed(event: MouseEvent) {
		const tilePoint = this.extractTileCoordinates(event);
		if (!tilePoint) return;
		this._currentTile = tilePoint;
		this._isApplying = true;
		this._applyTo(tilePoint, false);

		document.addEventListener("mousemove", this);
		document.addEventListener("mouseup", this);

		event.preventDefault();
		event.stopImmediatePropagation();
	}

	protected _mouseMoved(event: MouseEvent) {
		const tilePoint = this.extractTileCoordinates(event);
		if (!tilePoint) return;
		if (this._currentTile.isEqualTo(tilePoint)) return;
		this._currentTile = tilePoint;

		if (this._isApplying) this._applyTo(tilePoint, true);
		else this._drawPreview(tilePoint);

		event.preventDefault();
		event.stopImmediatePropagation();
	}

	protected _mouseReleased(event: MouseEvent) {
		this.finalize(this._currentTile);

		this._isApplying = false;
		document.removeEventListener("mousemove", this);
		document.removeEventListener("mouseup", this);

		this._drawPreview(this._currentTile);

		event.preventDefault();
		event.stopImmediatePropagation();
	}

	protected extractTileCoordinates(event: MouseEvent) {
		const zone = this.zone;

		const offset = event.offsetIn(this.canvas);
		const point = offset.scaleBy(1 / TileWidth).floor();
		if (point.x < 0 || point.y < 0 || point.x >= zone.size.width || point.y >= zone.size.height) return null;

		return point;
	}

	set tile(t) {
		this._tile = t;
	}

	get tile() {
		return this._tile;
	}
}

export default AbstractDrawingTool;
