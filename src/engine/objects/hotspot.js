import Type from "./hotspot-type";
export { Type };

class Hotspot {
	static get Type() {
		return Type;
	}

	constructor() {
		this._x = -1;
		this._y = -1;

		this.enabled = false;
		this.arg = -1;
		this.type = -1;

		Object.seal(this);
	}

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}
}
export default Hotspot;
