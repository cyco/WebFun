import "./abstract-palette-view.scss";

import { Point, Size } from "src/util";

import { ColorPalette } from "src/engine";
import { drawImage } from "src/app/webfun/rendering";
import { Component } from "src/ui";

abstract class AbstractPaletteView extends Component {
	public static readonly observedAttributes: string[] = [];

	private _palette: ColorPalette;
	private _image: Uint8Array;
	private _size: Size;

	protected canvas: HTMLCanvasElement = (<canvas />) as HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
	private imageData: ImageData = null;

	protected connectedCallback(): void {
		this.appendChild(this.canvas);
		this.redraw();
	}

	protected get pixelSize(): Size {
		const { width: totalWidth, height: totalHeight } = this.canvas.getBoundingClientRect();
		return new Size(totalWidth / this.size.width, totalHeight / this.size.height);
	}

	public redraw(_: Point = null): void {
		if (this.size) {
			this.ctx.clearRect(0, 0, this.size.width, this.size.height);
		}

		if (!this.ctx) return;
		if (!this.size) return;
		if (!this.palette) return;
		if (!this.image) return;

		this.imageData = drawImage(this.image, this.size, this.palette);
		this.ctx.putImageData(this.imageData, 0, 0);
	}

	public get renderedImage(): ImageData {
		return this.imageData;
	}

	set size(s: Size) {
		this._size = s;
		this.canvas.width = s.width;
		this.canvas.height = s.height;
	}

	get size(): Size {
		return this._size;
	}

	set palette(p: ColorPalette) {
		this._palette = p;
		this.redraw();
	}

	get palette(): ColorPalette {
		return this._palette;
	}

	set image(p: Uint8Array) {
		this._image = p;
		this.redraw();
	}

	get image(): Uint8Array {
		return this._image;
	}

	get imageDataURL(): string {
		return this.canvas.toDataURL();
	}
}

export default AbstractPaletteView;
