import AbstractTool from "src/app/editor/tools/abstract-tool";
import { Point } from "src/util";
import { Tile, Zone } from "src/engine/objects";

abstract class AbstractDrawingTool extends AbstractTool implements EventListenerObject {
	protected _ctx: CanvasRenderingContext2D;
	protected _currentTile: Point = new Point(-1, -1);
	protected _tile: Tile = null;
	private _isApplying: boolean = false;

	public activate(zone: Zone, overlay: HTMLCanvasElement): void {
		super.activate(zone, overlay);

		this._ctx = overlay.getContext("2d");
		this._ctx.save();
		this._ctx.setTransform(
			window.devicePixelRatio * Tile.WIDTH,
			0,
			0,
			window.devicePixelRatio * Tile.HEIGHT,
			0,
			0
		);

		this.canvas.addEventListener("mousedown", this);
		this.canvas.addEventListener("mousemove", this);
		this.canvas.addEventListener("mouseenter", this);
		this.canvas.addEventListener("mouseleave", this);
	}

	public deactivate(): void {
		if (this.zone) {
			this._ctx.clearRect(0, 0, this.zone.size.width, this.zone.size.height);
		}
		this._ctx.restore();

		this.canvas.removeEventListener("mousedown", this);
		this.canvas.removeEventListener("mousemove", this);
		this.canvas.removeEventListener("mouseenter", this);
		this.canvas.removeEventListener("mouseleave", this);

		document.removeEventListener("mousemove", this);
		document.removeEventListener("mouseup", this);

		this._isApplying = false;

		super.deactivate();
	}

	private _drawPreview(point: Point) {
		this._ctx.clearRect(0, 0, this.zone.size.width, this.zone.size.height);
		this.drawPreview(point);
	}

	private _applyTo(point: Point, continuous: boolean) {
		this._ctx.clearRect(0, 0, this.zone.size.width, this.zone.size.height);
		this.applyTo(point, continuous);
	}

	protected abstract drawPreview(point: Point): void;

	protected abstract applyTo(point: Point, continuous: boolean): void;

	protected finalize(_: Point): void {}

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

	protected _mousePressed(event: MouseEvent): void {
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

	protected _mouseMoved(event: MouseEvent): void {
		const tilePoint = this.extractTileCoordinates(event);
		if (!tilePoint) return;
		if (this._currentTile.isEqualTo(tilePoint)) return;
		this._currentTile = tilePoint;

		if (this._isApplying) this._applyTo(tilePoint, true);
		else this._drawPreview(tilePoint);

		event.preventDefault();
		event.stopImmediatePropagation();
	}

	protected _mouseReleased(event: MouseEvent): void {
		this.finalize(this._currentTile);

		this._isApplying = false;
		document.removeEventListener("mousemove", this);
		document.removeEventListener("mouseup", this);

		this._drawPreview(this._currentTile);

		event.preventDefault();
		event.stopImmediatePropagation();
	}

	protected extractTileCoordinates(event: MouseEvent): Point {
		const zone = this.zone;

		const offset = event.offsetIn(this.canvas);
		const point = offset.scaleBy(1 / Tile.WIDTH).floor();
		if (point.x < 0 || point.y < 0 || point.x >= zone.size.width || point.y >= zone.size.height)
			return null;

		return point;
	}

	set tile(t: Tile) {
		this._tile = t;
	}

	get tile(): Tile {
		return this._tile;
	}
}

export default AbstractDrawingTool;
