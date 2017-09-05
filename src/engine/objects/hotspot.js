import Type from "./hotspot-type";
import Point from "src/util/point";

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

	get location() {
		return new Point(this.x, this.y);
	}
}

export default Hotspot;
