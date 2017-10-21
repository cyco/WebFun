import Point from "src/util/point";
import Type from "./hotspot-type";

export { Type };

class Hotspot {
	public _x: number = -1;
	public _y: number = -1;

	public enabled: boolean = false;
	public arg: number = -1;
	public type: Type = null;

	static get Type() {
		return Type;
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
