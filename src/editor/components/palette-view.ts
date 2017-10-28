import { Component } from "src/ui";
import { ColorPalette } from "src/engine";
import Size from "src/util/size";
import { ImageFactory } from "src/engine/rendering/canvas";
import "./palette-view.scss";

class PaletteView extends Component {
	public static readonly TagName = "wf-palette-view";
	public static readonly observedAttributes: string[] = [];

	public palette: ColorPalette;
	public image: Uint8Array;
	private _canvas: HTMLCanvasElement = document.createElement("canvas");
	private _ctx: CanvasRenderingContext2D = null;
	private _size: Size;

	connectedCallback() {
		this.appendChild(this._canvas);
		this._ctx = this._canvas.getContext("2d");
		this.redraw();
	}

	public redraw() {
		if (!this._ctx) return;

		const imageFactory = new ImageFactory();
		imageFactory.palette = this.palette;
		const image = imageFactory.createImageData(this._size.width, this._size.height, this.image);
		this._ctx.putImageData(image, 0, 0);
	}

	set size(s) {
		this._size = s;
		this._canvas.width = s.width;
		this._canvas.height = s.height;
	}

	get size() {
		return this._size;
	}
}

export default PaletteView;
