import { Component } from "src/ui";
import { CompressedColorPalette } from "src/engine/rendering";
import "./abstract-palette-view.scss";

abstract class AbstractTileView extends Component {
	protected _palette: CompressedColorPalette;
	protected _canvas = <canvas /> as HTMLCanvasElement;

	public abstract draw(): void;

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._canvas);
	}

	disconnectedCallback() {
		this.removeChild(this._canvas);
		super.disconnectedCallback();
	}

	public set palette(p: CompressedColorPalette) {
		this._palette = p;
		this.draw();
	}

	public get palette() {
		return this._palette;
	}
}
export default AbstractTileView;
