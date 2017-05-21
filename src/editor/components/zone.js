import { Component } from '/ui';
import { Size, Point, rgba } from '/util';
import { Layer } from '/engine/objects/zone';

export const DrawMask = {
	None: 0,
	Floor: 1 << 0,
	Objects: 1 << 1,
	Roof: 1 << 2,
	Hotspot: 1 << 3,
	All: 0xF
};

const TileSize = 32.0;

export default class extends Component {
	static get TagName() {
		return "wf-editor-zone";
	}

	constructor() {
		super();

		this.tool = null;

		this._handlers = {
			mouseUp: (e) => this._mouseReleased(e)
		};

		this._backgroundColor = rgba(202, 198, 188, 0.98);
		this._hotspotColor = rgba(0, 0, 255, 0.2);
		this._layerMask = DrawMask.All;

		this._canvas = document.createElement('canvas');
		this._canvas.width = TileSize * 18;
		this._canvas.height = TileSize * 18;
		this._canvas.onmousemove = (e) => this._mouseMoved(e);
		this._canvas.onmousedown = (e) => this._mousePressed(e);

		this._context = this._canvas.getContext('2d');
		this._context.globalCompositeOperation = "source-over";
		this._context.webkitImageSmoothingEnabled = false;

		this._offset = new Point(0, 0);
		this._zoom = new Size(1, 1);
		this._zone = null;
		this._mouseIsPressed = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._canvas);
		this.draw();
	}

	set layerMask(m) {
		this._layerMask = m;
		this.draw();
	}

	get layerMask() {
		return this._layerMask;
	}

	set zone(z) {
		this._zone = z;
		this.calculateOffset();
		this.draw();
	}

	get zone() {
		return this._zone;
	}

	/* interaction */
	_mouseMoved(e) {
		if (!this.tool) return;

		const callback = this._mouseIsPressed ? this.tool.mouseDragged : this.tool.mouseMoved;
		this._exeuteCallback(callback, e);
	}

	_mousePressed(e) {
		if (this.tool) {
			this._exeuteCallback(this.tool.mouseDownAt, e);
		}

		this._mouseIsPressed = true;
		document.addEventListener('mouseup', this._handlers.mouseUp);
	}

	_exeuteCallback(handler, event) {
		const location = this._locationInTileCoordinates(this._locationInView(event));
		handler.call(this.tool, location && location.x, location && location.y, event);
		this.draw();
	}

	_mouseReleased(e) {
		if (this.tool) {
			this._exeuteCallback(this.tool.mouseUpAt, e);
		}

		this._mouseIsPressed = false;
		document.removeEventListener('mouseup', this._handlers.mouseUp);
	}

	_locationInView(e) {
		const mouseLocation = new Point(e.clientX, e.clientY);
		const boundingRect = this.getBoundingClientRect();
		const viewOffset = new Point(boundingRect.left, boundingRect.top);

		return Point.subtract(mouseLocation, viewOffset);
	}

	_locationInTileCoordinates(point) {
		if (!this._zone) return null;

		const tileCoordinates = point.subtract(this._offset).scaleBy(1 / TileSize).floor();
		if (tileCoordinates.x < 0) return null;
		if (tileCoordinates.x >= this._zone.width) return null;
		if (tileCoordinates.y < 0) return null;
		if (tileCoordinates.y >= this._zone.height) return null;

		return tileCoordinates;
	}

	/* drawing */
	calculateOffset() {
		const x = TileSize * (18.0 - this._zone.width) / 2.0;
		const y = TileSize * (18.0 - this._zone.height) / 2.0;

		this._offset = new Point(x, y);
		this._zoom = new Size(1, 1);
	}

	draw() {
		this._context.clearRect(0, 0, TileSize * 18 * this._zoom.width, TileSize * 18 * this._zoom.height);
		this._context.fillStyle = this._backgroundColor;
		this._context.fillRect(0, 0, TileSize * 18 * this._zoom.width, TileSize * 18 * this._zoom.height);

		if (!this._zone) return;

		for (let y = 0; y < this._zone.height; y++) {
			for (let x = 0; x < this.zone.width; x++) {
				this.drawPlace(x, y);
			}
		}

		if (this._layerMask & DrawMask.Hotspot) {
			this._zone.hotspots.forEach(htsp => {
				this.drawHotspot(htsp);
			});
		}
	}

	drawPlace(x, y) {
		this._layerMask & DrawMask.Floor && this.drawTile(x, y, Layer.Floor);
		this._layerMask & DrawMask.Objects && this.drawTile(x, y, Layer.Object);
		this._layerMask & DrawMask.Roof && this.drawTile(x, y, Layer.Roof);
	}

	clearPlace(x, y) {
		this._context.clearRect(this._offset.x + x * TileSize, this._offset.y + y * TileSize, TileSize, TileSize);
		this._context.fillStyle = this._backgroundColor;
		this._context.fillRect(this._offset.x + x * TileSize, this._offset.y + y * TileSize, TileSize, TileSize);
	}

	drawTile(x, y, z) {
		const tile = this._zone.getTile(x, y, z);
		if (!tile) return;
		this._context.drawImage(tile.image.representation, this._offset.x + x * TileSize, this._offset.y + y * TileSize);
	}

	drawHotspot(hotspot) {
		this._context.fillStyle = this._hotspotColor;
		this._context.fillRect(this._offset.x + hotspot.x * TileSize, this._offset.y + hotspot.y * TileSize, TileSize, TileSize);
	}
}
