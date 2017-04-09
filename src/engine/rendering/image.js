export default class {
	constructor(width, height, representation) {
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
