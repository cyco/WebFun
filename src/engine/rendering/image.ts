import { HTMLImageElement } from "src/std/dom";

class Image {
	protected _width: number;
	protected _height: number;
	protected _representation: HTMLImageElement;

	constructor(width: number, height: number, representation: HTMLImageElement) {
		this._width = width;
		this._height = height;
		this._representation = representation;
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}

	get representation() {
		return this._representation;
	}
}

export default Image;
