import "./abstract-zone-view.scss";

import { Tile, Zone } from "src/engine/objects";

import AbstractPaletteView from "./abstract-palette-view";
import { drawZoneImageData } from "src/app/webfun/rendering/canvas";

abstract class AbstractZoneView extends AbstractPaletteView {
	private _zone: Zone;

	public draw(): void {
		if (!this.palette) return;
		const context = this._canvas.getContext("2d");
		context.clearRect(0, 0, this._canvas.width, this._canvas.height);
		if (!this._zone) {
			return;
		}
		context.putImageData(drawZoneImageData(this._zone, this.palette), 0, 0);
	}

	public set zone(z: Zone) {
		this._zone = z;

		this._canvas.width = Tile.WIDTH * z.size.width;
		this._canvas.height = Tile.HEIGHT * z.size.height;
		this.draw();
	}

	public get zone(): Zone {
		return this._zone;
	}
}
export default AbstractZoneView;
