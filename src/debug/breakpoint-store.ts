import { EventTarget } from "src/util";
import { localStorage } from "src/std/dom";
import { LocationBreakpoint, SymbolicBreakpoint } from "./breakpoint";
import Breakpoint from "src/debug/breakpoint/breakpoint";

export const Events = {
	DidAddBreakpoint: "DidAddBreakpoint",
	DidRemoveBreakpoint: "DidRemoveBreakpoint"
};

const StorageKey = "debug.breakpoints";

class BreakpointStore extends EventTarget {
	public static readonly Event = Events;
	private static _sharedStore: BreakpointStore;
	private _breakpoints: { [_: string]: Breakpoint } = {};

	constructor() {
		super();

		this.registerEvents(Events);
		this._load();
	}

	public static get sharedStore() {
		return (this._sharedStore = this._sharedStore || new BreakpointStore());
	}

	public addBreakpoint(bpt: Breakpoint) {
		this._breakpoints[bpt.id] = bpt;
		this._store();
		this.dispatchEvent(new CustomEvent(Events.DidAddBreakpoint, { detail: { breakpoint: bpt } }));
	}

	public hasBreakpoint(id: string) {
		return !!this.getBreakpoint(id);
	}

	public getBreakpoint(id: string) {
		return this._breakpoints[id];
	}

	public removeBreakpoint(bpt: Breakpoint) {
		delete this._breakpoints[bpt.id];
		this._store();
		this.dispatchEvent(new CustomEvent(Events.DidRemoveBreakpoint, { detail: { breakpoint: bpt } }));
	}

	private _store() {
		localStorage.setItem(StorageKey, Object.keys(this._breakpoints).join(","));
	}

	private _load() {
		const storedValue = localStorage.getItem(StorageKey);
		if (!storedValue) return;

		try {
			storedValue.split(",").forEach(desc => {
				let breakpoint = null;
				if (desc.startsWith("@")) {
					const parts = desc.substr(1).split(":");
					breakpoint = new LocationBreakpoint(parts[0], parts[1], parts[2], parts[3]);
				} else if (desc.startsWith("SYM:")) {
					const parts = desc.substr(4).split(":");
					breakpoint = new SymbolicBreakpoint(parts[0], parts[1]);
				}

				if (breakpoint.id !== desc) {
					console.warn(`Unable to restore breakpoint ${desc}`);
				} else this._breakpoints[desc] = breakpoint;
			});
		} catch (e) {
			console.warn(`Unable to deserialize breakpoints! ${e}`);
		}
	}
}

export default BreakpointStore;
