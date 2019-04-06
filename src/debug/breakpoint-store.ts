import { DiscardingStorage, EventTarget } from "src/util";
import { LocationBreakpoint, SymbolicBreakpoint } from "./breakpoint";

import Breakpoint from "src/debug/breakpoint/breakpoint";

export const Events = {
	DidAddBreakpoint: "DidAddBreakpoint",
	DidRemoveBreakpoint: "DidRemoveBreakpoint"
};

const StorageKey = "breakpoints";

class BreakpointStore extends EventTarget {
	public static readonly Event = Events;
	private static _sharedStore: BreakpointStore;
	private _breakpoints: { [_: string]: Breakpoint } = {};
	private _backend: Storage = new DiscardingStorage();

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
		this._backend.setItem(StorageKey, Object.keys(this._breakpoints).join(","));
	}

	private _load() {
		const storedValue = this._backend.getItem(StorageKey);
		if (!storedValue) return;

		try {
			storedValue.split(",").forEach(desc => {
				let breakpoint = null;
				if (desc.startsWith("@")) {
					const parts = desc.substr(1).split(":");
					if (parts[2] !== undefined && parts[2] !== "c" && parts[2] !== "i") {
						console.warn(`Unable to restore breakpoint ${desc}`);
						return;
					}

					breakpoint = new LocationBreakpoint(
						+parts[0],
						+parts[1],
						parts[2] === "c" ? "c" : parts[2] === "i" ? "i" : null,
						parts[3] !== undefined ? +parts[3] : null
					);
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

	set backend(b: Storage) {
		this._backend = b;
		this._load();
	}

	get backend() {
		return this._backend;
	}
}

export default BreakpointStore;
