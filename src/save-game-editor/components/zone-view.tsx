import { Component } from "src/ui";
import { Zone, Tile } from "src/engine/objects";
import { CSSTileSheet } from "src/editor";
import { ColorPalette } from "src/engine";
import { Size } from "src/util";
import "./zone-view.scss";

class ZoneView extends Component implements EventListenerObject {
	public static readonly tagName = "wf-editor-zone";
	public size: Size = new Size(4 * 32, 4 * 32);
	private _canvas = <canvas className="pixelated" /> as HTMLCanvasElement;
	private _zone: Zone;
	public palette: ColorPalette;

	protected connectedCallback() {
		super.connectedCallback();
		this.addEventListener("click", this);
		this.appendChild(this._canvas);
	}

	handleEvent() {
		this.redraw();
	}

	protected disconnectedCallback() {
		this.removeEventListener("click", this);
		super.disconnectedCallback();
	}

	set zone(zone: Zone) {
		this._zone = zone;
		this.redraw();
	}

	private redraw() {
		const ctx = this._canvas.getContext("2d");
		const zone = this._zone;
		if (!zone) {
			ctx.clearRect(0, 0, 576, 576);
			return;
		}

		const TileWidth = Tile.WIDTH;
		const TileHeight = Tile.HEIGHT;
		const PreviewHeight = this.size.height;
		const PreviewWidth = this.size.width;

		this._canvas.setAttribute("width", `${zone.size.width * TileWidth}px`);
		this._canvas.setAttribute("height", `${zone.size.height * TileHeight}px`);
		this._canvas.style.width = `${PreviewWidth}px`;
		this._canvas.style.height = `${PreviewHeight}px`;
		this.style.width = `${PreviewWidth}px`;
		this.style.height = `${PreviewHeight}px`;

		const image = this.buildImageData(zone, this.palette);
		ctx.clearRect(0, 0, zone.size.width * TileWidth, zone.size.height * TileHeight);
		ctx.putImageData(image, 0, 0);
	}

	private buildImageData(zone: Zone, palette: ColorPalette) {
		const TileWidth = Tile.WIDTH;
		const TileHeight = Tile.HEIGHT;
		const ZoneWidth = zone.size.width;
		const ZoneHeight = zone.size.height;

		const imageData = new ImageData(ZoneWidth * TileWidth, ZoneHeight * TileHeight);
		const rawImageData = imageData.data;

		const bpr = 4 * ZoneWidth * TileWidth;

		for (let y = 0; y < ZoneHeight; y++) {
			for (let x = 0; x < ZoneWidth; x++) {
				for (let z = 0; z < Zone.LAYERS; z++) {
					let tile = zone.getTile(x, y, z);
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
		}

		return imageData;
	}

	get zone() {
		return this._zone;
	}
}

export default ZoneView;
