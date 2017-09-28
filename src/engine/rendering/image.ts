class Image {
	protected _width: number;
	protected _height: number;
	protected _representation: any;

	constructor(width: number, height: number, representation: any) {
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
