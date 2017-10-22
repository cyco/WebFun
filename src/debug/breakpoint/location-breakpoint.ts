import Breakpoint from "./breakpoint";
import Zone from "src/engine/objects/zone";
import Action from "src/engine/objects/action";

class LocationBreakpoint extends Breakpoint {
	protected _path: any[];

	constructor(zone: Zone, action: Action, type: any = null, idx: number = null) {
		super();

		this._path = [zone, action];

		if (type !== null) this._path.push(type);
		if (idx !== null) this._path.push(idx);
	}

	get id() {
		return `@${this._path.join(":")}`;
	}
}
export default LocationBreakpoint;
