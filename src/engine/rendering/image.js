export default class {
	constructor(width, height, representation) {
		this._width = width;
		this._height = height;
		this._representation = representation;
	}

	get width() {
		return width;
	}

	get height() {
		return height;
	}

	get representation() {
		return this._representation;
	}
}
