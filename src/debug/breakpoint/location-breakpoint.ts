import Breakpoint from "./breakpoint";

class LocationBreakpoint extends Breakpoint {
	protected _path: any[];

	constructor(zone: any, action: any, type: any = null, idx: any = null) {
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
