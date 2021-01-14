import "./abstract-palette-image-view.scss";

import AbstractPaletteView from "./abstract-palette-view";
import { Size } from "src/util";
import { drawImage } from "src/app/webfun/rendering/canvas";

abstract class AbstractPaletteImageView extends AbstractPaletteView {
	private _pixels: Uint8Array;
	private _size: Size;

	public draw(): void {
		if (!this.palette) return;
		const context = this._canvas.getContext("2d");
		context.clearRect(0, 0, this._canvas.width, this._canvas.height);
		if (!this._pixels || !this._size) {
			return;
		}
		context.putImageData(drawImage(this.pixels, this.size, this.palette), 0, 0);
	}

	public set size(size: Size) {
		this._canvas.width = size.width;
		this._canvas.height = size.height;
	}

	public get size(): Size {
		return new Size(this._canvas.width, this._canvas.height);
	}

	public set pixels(p: Uint8Array) {
		this._pixels = p;
		this.draw();
	}

	public get pixels(): Uint8Array {
		return this._pixels;
	}
}

export default AbstractPaletteImageView;
