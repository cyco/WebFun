import "./zone-picker-cell.scss";

import { Tile, Zone } from "src/engine/objects";

import { Cell } from "src/ui/components";
import { ColorPalette } from "src/engine/rendering";
import { drawZoneImageData } from "src/app/webfun/rendering/canvas";

class ZonePickerCell extends Cell<Zone> {
	public static readonly tagName = "wf-debug-zone-picker-cell";
	public static readonly observedAttributes: string[] = [];

	private _palette: ColorPalette;
	private _canvas = (<canvas className="pixelated" />) as HTMLCanvasElement;

	protected connectedCallback(): void {
		super.connectedCallback();
		this.appendChild(this._canvas);
		this.draw();
	}

	private draw() {
		if (!this.palette || !this.data) {
			return;
		}

		const context = this._canvas.getContext("2d");
		context.clearRect(0, 0, this.data.size.width * Tile.WIDTH, this.data.size.height * Tile.HEIGHT);
		const imageData = drawZoneImageData(this.data, this.palette);
		context.putImageData(imageData, 0, 0);
	}

	protected disconnectedCallback(): void {
		this._canvas.remove();
		super.disconnectedCallback();
	}

	public cloneNode(deep?: boolean): ZonePickerCell {
		const node = super.cloneNode(deep) as ZonePickerCell;
		node.palette = this.palette;
		node.onclick = this.onclick;
		return node;
	}

	set data(d: Zone) {
		this._data = d;
		if (d) {
			this._canvas.setAttribute("width", `${d.size.width * Tile.WIDTH}`);
			this._canvas.setAttribute("height", `${d.size.height * Tile.HEIGHT}`);
		}
		if (this.isConnected) this.draw();
	}

	get data(): Zone {
		return this._data;
	}

	set palette(d: ColorPalette) {
		this._palette = d;
		if (this.isConnected) this.draw();
	}

	get palette(): ColorPalette {
		return this._palette;
	}
}

export default ZonePickerCell;
