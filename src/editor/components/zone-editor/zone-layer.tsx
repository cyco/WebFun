import "./zone-layer.scss";

import Tile, { HEIGHT as TileHeight, WIDTH as TileWidth } from "src/engine/objects/tile";

import { ColorPalette } from "src/engine/rendering";
import Component from "src/ui/component";
import { MenuItemInit } from "src/ui";
import { Point } from "src/util";
import { default as Zone } from "src/engine/objects/zone";

class ZoneLayer extends Component {
	public static readonly tagName = "wf-zone-layer";
	public static readonly observedAttributes: string[] = [];
	private _zone: Zone = null;
	private _layer: number = null;
	private _canvas = <canvas /> as HTMLCanvasElement;
	private _palette: ColorPalette = null;
	private _imageData: ImageData = null;

	protected connectedCallback() {
		this.appendChild(this._canvas);
		this.draw();
	}

	private draw(): void {
		if (this._layer === null) return;
		if (!this._zone) return;
		if (!this._palette) return;

		const ctx = this._canvas.getContext("2d");
		if (!this._imageData) {
			this._imageData = this.drawLayer();
		}

		ctx.clearRect(0, 0, 288, 288);
		ctx.putImageData(this._imageData, 0, 0);
	}

	private drawLayer() {
		const layer = this._layer;
		const zone = this._zone;
		const palette = this._palette;

		const TileWidth = Tile.WIDTH;
		const TileHeight = Tile.HEIGHT;
		const ZoneWidth = zone.size.width;
		const ZoneHeight = zone.size.height;

		const result = new ImageData(ZoneWidth * TileWidth, ZoneHeight * TileHeight);
		var buffer = new ArrayBuffer(result.data.length);
		var byteArray = new Uint8Array(buffer);
		var data = new Uint32Array(buffer);
		const bpr = ZoneWidth * TileWidth;

		for (let y = 0; y < ZoneHeight; y++) {
			for (let x = 0; x < ZoneWidth; x++) {
				let tile = zone.getTile(x, y, layer);
				if (!tile) continue;

				const pixels = tile.imageData;
				const sy = y * TileHeight;
				const sx = x * TileWidth;
				let j = sy * bpr + sx;

				for (let ty = 0; ty < TileHeight; ty++) {
					for (let tx = 0; tx < TileWidth; tx++) {
						const i = ty * TileWidth + tx;
						data[j + tx] = palette[pixels[i]];
					}

					j += bpr;
				}
			}
		}
		result.data.set(byteArray);

		return result;
	}

	private _updateTile(tile: Tile, at: Point): void {
		if (!this._imageData) return;

		const zone = this._zone;
		const palette = this._palette;

		const TileWidth = Tile.WIDTH;
		const TileHeight = Tile.HEIGHT;
		const ZoneWidth = zone.size.width;

		const imageData = this._imageData;
		var buffer = imageData.data.buffer;
		var byteArray = new Uint8Array(buffer);
		var data = new Uint32Array(buffer);
		const bpr = ZoneWidth * TileWidth;

		const pixels = tile ? tile.imageData : null;
		const sy = at.y * TileHeight;
		const sx = at.x * TileWidth;
		let j = sy * bpr + sx;

		for (let ty = 0; ty < TileHeight; ty++) {
			for (let tx = 0; tx < TileWidth; tx++) {
				const i = ty * TileWidth + tx;
				data[j + tx] = palette[pixels ? pixels[i] : 0];
			}

			j += bpr;
		}
		imageData.data.set(byteArray);
	}

	public update(points: Point[]) {
		if (this._layer === null) return;
		if (!this._zone) return;

		const zone = this._zone;
		const ctx = this._canvas.getContext("2d");
		points.forEach(p => {
			const tile = zone.getTile(p.x, p.y, this._layer);
			ctx.clearRect(p.x, p.y, Tile.WIDTH, Tile.HEIGHT);
			this._updateTile(tile, p);
		});
		this.draw();
	}

	set zone(zone: Zone) {
		this._zone = zone;

		this._canvas.width = zone.size.width * TileWidth;
		this._canvas.height = zone.size.height * TileHeight;
		this._canvas.style.width = zone.size.width * TileWidth + "px";
		this._canvas.style.height = zone.size.height * TileHeight + "px";

		this._imageData = null;
		if (this.isConnected) this.draw();
	}

	get zone() {
		return this._zone;
	}

	set layer(zoneLayer: number) {
		this._layer = zoneLayer;

		this._imageData = null;
		if (this.isConnected) this.draw();
	}

	get layer() {
		return this._layer;
	}

	set palette(p: ColorPalette) {
		this._palette = p;

		this._imageData = null;
		if (this.isConnected) this.draw();
	}

	get palette() {
		return this._palette;
	}

	public getMenuForTile(_: Point): Partial<MenuItemInit>[] {
		return [];
	}
}

export default ZoneLayer;
