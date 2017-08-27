global.Storage = class {
	constructor() {
		this._values = {};
	}

	setItem(key, value) {
		this._values[key] = "" + value;
	}

	getItem(key) {
		return this._values[key] === undefined ? null : this._values[key];
	}

	clear() {
		this._values = {};
	}
};
