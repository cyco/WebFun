import { Component } from "src/ui";
import { ColorPalette } from "src/engine";
import { Point, Size } from "src/util";
import { ImageFactory } from "src/engine/rendering/canvas";
import "./palette-view.scss";

class PaletteView extends Component {
	public static readonly tagName = "wf-palette-view";
	public static readonly observedAttributes: string[] = [];

	public palette: ColorPalette;
	public image: Uint8Array;
	private _canvas: HTMLCanvasElement = document.createElement("canvas");
	private _ctx: CanvasRenderingContext2D = null;
	private _size: Size;
	private highlighter: HTMLElement = document.createElement("div");
	private _imageData: ImageData;

	protected connectedCallback() {
		this.appendChild(this._canvas);
		this._ctx = this._canvas.getContext("2d");
		this.redraw();

		this.highlighter.classList.add("highlighter");
		this.appendChild(this.highlighter);
	}

	public redraw() {
		if (!this._ctx) return;

		const imageFactory = new ImageFactory();
		imageFactory.palette = this.palette;
		this._imageData = imageFactory.createImageData(
			this._size.width,
			this._size.height,
			this.image
		);
		this._ctx.putImageData(this._imageData, 0, 0);
	}

	public get renderedImage() {
		return this._imageData;
	}

	public moveHighlighterTo(point: Point) {
		this.highlighter.style.left = `${point.x - 1}px`;
		this.highlighter.style.top = `${point.y - 1}px`;
	}

	set size(s) {
		this._size = s;
		this._canvas.width = s.width;
		this._canvas.height = s.height;
		this._canvas.style.width = `${s.width + 2}px`;
		this._canvas.style.height = `${s.height + 2}px`;
	}

	get size() {
		return this._size;
	}
}

export default PaletteView;
