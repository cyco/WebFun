import "./abstract-palette-view.scss";

import { ColorPalette } from "src/engine/rendering";
import { Component } from "src/ui";

abstract class AbstractTileView extends Component {
	protected _palette: ColorPalette;
	protected _canvas = (<canvas />) as HTMLCanvasElement;

	public abstract draw(): void;

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._canvas);
	}

	disconnectedCallback() {
		this.removeChild(this._canvas);
		super.disconnectedCallback();
	}

	public set palette(p: ColorPalette) {
		this._palette = p;
		this.draw();
	}

	public get palette() {
		return this._palette;
	}
}
export default AbstractTileView;
