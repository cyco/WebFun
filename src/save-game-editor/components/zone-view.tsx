import { Component } from "src/ui";
import { Zone, Tile } from "src/engine/objects";
import { drawZoneImageData } from "src/engine/rendering/canvas";
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

		const image = drawZoneImageData(zone, this.palette);
		ctx.clearRect(0, 0, zone.size.width * TileWidth, zone.size.height * TileHeight);
		ctx.putImageData(image, 0, 0);
	}

	get zone() {
		return this._zone;
	}
}

export default ZoneView;
