import { Point } from "src/util";
import Type from "./hotspot-type";

export { Type };

class Hotspot {
	public x: number = -1;
	public y: number = -1;

	public enabled: boolean = false;
	public arg: number = -1;
	public type: Type = null;

	static get Type() {
		return Type;
	}

	get location() {
		return new Point(this.x, this.y);
	}
}

export default Hotspot;
