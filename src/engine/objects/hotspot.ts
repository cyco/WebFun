import { Point } from "src/util";
import HotspotType from "./hotspot-type";

class Hotspot {
	public static readonly Type = HotspotType;

	public id: number = 0;
	public x: number = -1;
	public y: number = -1;

	public enabled: boolean = false;
	public arg: number = -1;
	public type: HotspotType = null;

	get location() {
		return new Point(this.x, this.y);
	}
}

namespace Hotspot {
	export type Type = HotspotType;
}

export default Hotspot;
