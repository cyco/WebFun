import "./abstract-tile-view.scss";

import AbstractPaletteView from "./abstract-palette-view";
import { Tile } from "src/engine/objects";
import { drawTileImageData } from "src/app/rendering/canvas";

abstract class AbstractTileView extends AbstractPaletteView {
	private _tile: Tile;

	constructor() {
		super();

		this._canvas.width = Tile.WIDTH;
		this._canvas.height = Tile.HEIGHT;
	}

	public draw() {
		if (!this.palette) return;
		const context = this._canvas.getContext("2d");
		context.clearRect(0, 0, Tile.WIDTH, Tile.HEIGHT);
		if (!this._tile) {
			return;
		}
		context.putImageData(drawTileImageData(this._tile, this.palette), 0, 0);
	}

	public set tile(t: Tile) {
		this._tile = t;
		this.draw();
	}

	public get tile() {
		return this._tile;
	}
}
export default AbstractTileView;
