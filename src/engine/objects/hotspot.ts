import Type from "./hotspot-type";
import Point from "src/util/point";

export { Type };

class Hotspot {
	public _x: number = -1;
	public _y: number = -1;

	public enabled: boolean = false;
	public arg: number = -1;
	public type: number;

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


	set x(x) {
		this._x = x;
	}

	get y() {
		return this._y;
	}

	set y(y) {
		this._y = y;
	}

	get location() {
		return new Point(this.x, this.y);
	}
}

export default Hotspot;
