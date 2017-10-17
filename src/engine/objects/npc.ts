class NPC {
	public _enabled = true;
	public _face: number;
	public _x: number;
	public _y: number;
	public _unknown1: any;
	public _unknown2: any;
	public _data: any;

	constructor({face, x, y, unknown1, unknown2, unknown3}: {face: number, x: number, y: number, unknown1: any, unknown2: any, unknown3: any}) {
		this._enabled = true;
		this._face = face;
		this._x = x;
		this._y = y;

		this._unknown1 = unknown1;
		this._unknown2 = unknown2;
		this._data = unknown3;
	}

	get id() {
		// TODO: implement
		return -1;
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

export default NPC;
