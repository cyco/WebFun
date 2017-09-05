export default class NPC {
	constructor({ face, x, y, unknown1, unknown2, unknown3 }) {
		this._enabled = true;
		this._face = face;
		this._x = x;
		this._y = y;

		this._unknown1 = unknown1;
		this._unknown2 = unknown2;
		this._data = unknown3;
	}

	get enabled() {
		return this._enabled;
	}

	set enabled(flag) {
		this._enabled = flag;
	}

	get face() {
		return this._face;
	}

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}

	get unknown1() {
		return this._unknown1;
	}

	get unknown2() {
		return this._unknown2;
	}

	get unknown3() {
		return this._data;
	}
}
