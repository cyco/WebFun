import AbstractPaletteView from "./abstract-palette-view";
import { Size } from "src/util";
import { drawImage } from "src/app/rendering/canvas";
import "./abstract-palette-image-view.scss";

abstract class AbstractPaletteImageView extends AbstractPaletteView {
	private _pixels: Uint8Array;
	private _size: Size;

	public draw() {
		if (!this.palette) return;
		const context = this._canvas.getContext("2d");
		context.clearRect(0, 0, this._canvas.width, this._canvas.height);
		if (!this._pixels || !this._size) {
			return;
		}
		context.putImageData(drawImage(this.pixels, this.size, this.palette.decompress()), 0, 0);
	}

	public set size(size: Size) {
		this._canvas.width = size.width;
		this._canvas.height = size.height;
	}

	public get size() {
		return new Size(this._canvas.width, this._canvas.height);
	}

	public set pixels(p: Uint8Array) {
		this._pixels = p;
		this.draw();
	}

	public get pixels() {
		return this._pixels;
	}
}

export default AbstractPaletteImageView;
