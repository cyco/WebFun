import { Component } from "src/ui";
import { ColorPalette } from "src/engine/rendering";

abstract class AbstractTileView extends Component {
	protected _palette: ColorPalette;
	protected _canvas = <canvas className="pixelated" /> as HTMLCanvasElement;

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
