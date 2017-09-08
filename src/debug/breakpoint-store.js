import { EventTarget } from "src/util";
import { localStorage } from "std.dom";
import { LocationBreakpoint, SymbolicBreakpoint } from "./breakpoint";

let sharedInstance = null;

export const Events = {
	DidAddBreakpoint: "DidAddBreakpoint",
	DidRemoveBreakpoint: "DidRemoveBreakpoint"
};

const StorageKey = "debug.breakpoints";

export default class BreakpointStore extends EventTarget {
	static get Event() {
		return Events;
	}

	static get sharedStore() {
		return sharedInstance || (sharedInstance = new BreakpointStore());
	}

	constructor() {
		super();

		this._breakpoints = {};
		this.registerEvents(Events);

		this._load();
	}

	addBreakpoint(bpt) {
		this._breakpoints[bpt.id] = bpt;
		this._store();
		this.dispatchEvent(new Event(Events.DidAddBreakpoint), {detail: {breakpoint: bpt}});
	}

	hasBreakpoint(id) {
		return !!this.getBreakpoint(id);
	}

	getBreakpoint(id) {
		return this._breakpoints[id];
	}

	removeBreakpoint(bpt) {
		delete this._breakpoints[bpt.id];
		this._store();
		this.dispatchEvent(new Event(Events.DidRemoveBreakpoint), {detail: {breakpoint: bpt}});
	}

	_store() {
		localStorage.setItem(StorageKey, Object.keys(this._breakpoints).join(","));
	}

	_load() {
		const storedValue = localStorage.getItem(StorageKey, this._breakpoints);
		if (!storedValue) return;

		try {
			storedValue.split(",").map(desc => {
				let breakpoint = null;
				if (desc.startsWith("@")) breakpoint = new LocationBreakpoint(...desc.substr(1).split(":"));
				else if (desc.startsWith("SYM:")) breakpoint = new SymbolicBreakpoint(...desc.substr(4).split(":"));

				if (breakpoint.id !== desc) {
					console.warn(`Unable to restore breakpoint ${desc}`);
				} else this._breakpoints[desc] = breakpoint;
			});
		} catch (e) {
			console.warn(`Unable to deserialize breakpoints! ${e}`);
		}
	}
}
