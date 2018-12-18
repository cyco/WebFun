import Component from "src/ui/component";
import { default as Zone } from "src/engine/objects/zone";
import Tile, { HEIGHT as TileHeight, WIDTH as TileWidth } from "src/engine/objects/tile";
import { Point } from "src/util";
import { CompressedColorPalette } from "src/engine/rendering";
import { MenuItemInit } from "src/ui";
import "./zone-layer.scss";

class ZoneLayer extends Component {
	public static readonly tagName = "wf-zone-layer";
	public static readonly observedAttributes: string[] = [];
	private _zone: Zone;
	private _layer: number;
	private _canvas: HTMLCanvasElement;
	private _palette: CompressedColorPalette;
	private _imageData: ImageData;

	constructor() {
		super();

		this._canvas = document.createElement("canvas");
	}

	protected connectedCallback() {
		this.appendChild(this._canvas);
		this.draw();
	}

	private draw(): void {
		if (this._layer === undefined) return;
		if (!this._zone) return;
		if (!this._palette) return;

		const ctx = this._canvas.getContext("2d");
		if (!this._imageData) {
			this._imageData = this.drawLayer();
		}

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

		const imageData = new ImageData(ZoneWidth * TileWidth, ZoneHeight * TileHeight);
		const rawImageData = imageData.data;

		const bpr = 4 * ZoneWidth * TileWidth;

		for (let y = 0; y < ZoneHeight; y++) {
			for (let x = 0; x < ZoneWidth; x++) {
				let tile = zone.getTile(x, y, layer);
				if (!tile) continue;

				const pixels = tile.imageData;
				const sy = y * TileHeight;
				const sx = x * TileWidth;
				let j = sy * bpr + sx * 4;

				for (let ty = 0; ty < TileHeight; ty++) {
					for (let tx = 0; tx < TileWidth; tx++) {
						const i = ty * TileWidth + tx;
						const paletteIndex = pixels[i] * 4;
						if (paletteIndex === 0) continue;

						rawImageData[j + 4 * tx + 0] = palette[paletteIndex + 2];
						rawImageData[j + 4 * tx + 1] = palette[paletteIndex + 1];
						rawImageData[j + 4 * tx + 2] = palette[paletteIndex + 0];
						rawImageData[j + 4 * tx + 3] = paletteIndex === 0 ? 0x00 : 0xff;
					}

					j += bpr;
				}
			}
		}

		return imageData;
	}

	private _updateTile(tile: Tile, at: Point): void {
		if (!this._imageData) return;

		const zone = this._zone;
		const palette = this._palette;

		const TileWidth = Tile.WIDTH;
		const TileHeight = Tile.HEIGHT;
		const ZoneWidth = zone.size.width;

		const imageData = this._imageData;
		const rawImageData = imageData.data;

		const bpr = 4 * ZoneWidth * TileWidth;

		const pixels = tile ? tile.imageData : null;
		const sy = at.y * TileHeight;
		const sx = at.x * TileWidth;
		let j = sy * bpr + sx * 4;

		for (let ty = 0; ty < TileHeight; ty++) {
			for (let tx = 0; tx < TileWidth; tx++) {
				const i = ty * TileWidth + tx;
				const paletteIndex = pixels ? pixels[i] * 4 : 0;
				if (paletteIndex === 0) {
					rawImageData[j + 4 * tx + 0] = 0;
					rawImageData[j + 4 * tx + 1] = 0;
					rawImageData[j + 4 * tx + 2] = 0;
					rawImageData[j + 4 * tx + 3] = 0;
					continue;
				}

				rawImageData[j + 4 * tx + 0] = palette[paletteIndex + 2];
				rawImageData[j + 4 * tx + 1] = palette[paletteIndex + 1];
				rawImageData[j + 4 * tx + 2] = palette[paletteIndex + 0];
				rawImageData[j + 4 * tx + 3] = paletteIndex === 0 ? 0x00 : 0xff;
			}

			j += bpr;
		}
	}

	public update(points: Point[]) {
		if (this._layer === undefined) return;
		if (!this._zone) return;

		const zone = this._zone;
		const ctx = this._canvas.getContext("2d");
		points.forEach(p => {
			const tile = zone.getTile(p.x, p.y, this._layer);
			ctx.clearRect(p.x, p.y, 1, 1);
			this._updateTile(tile, p);
			this.draw();
		});
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

	set palette(p: CompressedColorPalette) {
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
