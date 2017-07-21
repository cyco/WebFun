import Breakpoint from "./breakpoint";

export default class extends Breakpoint {
	constructor(zone, action, type = null, idx = null) {
		super();

		this._path = [zone, action];

		if (type !== null) this._path.push(type);
		if (idx !== null) this._path.push(idx);
	}

	get id() {
		return `@${this._path.join(':')}`;
	}
}
