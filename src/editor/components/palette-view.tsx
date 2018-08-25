import { Component } from "src/ui";
import { ColorPalette } from "src/engine";
import { Size, Point } from "src/util";
import { ImageFactory } from "src/engine/rendering/canvas";
import "./palette-view.scss";

class PaletteView extends Component {
	public static tagName = "wf-palette-view";
	public static readonly observedAttributes: string[] = [];

	private _palette: ColorPalette;
	private _image: Uint8Array;
	private _size: Size;

	protected canvas: HTMLCanvasElement = <canvas /> as HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
	private imageData: ImageData;

	protected connectedCallback() {
		this.appendChild(this.canvas);
		this.redraw();
	}

	protected get pixelSize() {
		const { width: totalWidth, height: totalHeight } = this.canvas.getBoundingClientRect();
		return new Size(totalWidth / this.size.width, totalHeight / this.size.height);
	}

	public redraw(dirty: Point = null) {
		if (!this.ctx) return;
		if (!this.size) return;
		if (!this.palette) return;
		if (!this.image) return;

		const imageFactory = new ImageFactory();
		imageFactory.palette = this.palette;
		this.imageData = imageFactory.createImageData(this._size.width, this._size.height, this.image);
		this.ctx.putImageData(this.imageData, 0, 0);
	}

	public get renderedImage() {
		return this.imageData;
	}

	set size(s) {
		this._size = s;
		this.canvas.width = s.width;
		this.canvas.height = s.height;
	}

	get size() {
		return this._size;
	}

	set palette(p) {
		this._palette = p;
		this.redraw();
	}

	get palette() {
		return this._palette;
	}

	set image(p) {
		this._image = p;
		this.redraw();
	}

	get image() {
		return this._image;
	}
}

export default PaletteView;
