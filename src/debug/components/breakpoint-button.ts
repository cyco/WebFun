import { Component } from "src/ui";
import BreakpointStore from "../breakpoint-store";
import "./breakpoint-button.scss";
import { Breakpoint } from "../breakpoint";

export const Events = {
	DidSet: "DidSet",
	DidUnset: "DidUnset"
};

class BreakpointButton extends Component {
	static readonly Event = Events;
	static readonly tagName = "wf-debug-breakpoint-button";
	static readonly observedAttributes = ["active"];
	public breakpoint: Breakpoint = null;
	private _store: BreakpointStore = BreakpointStore.sharedStore;
	private _removeHandler = ({ detail: { breakpoint } }: CustomEvent) =>
		breakpoint === this.breakpoint && (this.active = false);
	private _addHandler = ({ detail: { breakpoint } }: CustomEvent) =>
		breakpoint === this.breakpoint && (this.active = true);

	get active() {
		return this.hasAttribute("active");
	}

	set active(flag) {
		if (flag) this.setAttribute("active", "");
		else this.removeAttribute("active");
	}

	protected connectedCallback() {
		this.onclick = () => this.toggle();
		this.active = this._store.hasBreakpoint(this.breakpoint.id);
		this._store.addEventListener(BreakpointStore.Event.DidAddBreakpoint, this._addHandler);
		this._store.addEventListener(BreakpointStore.Event.DidRemoveBreakpoint, this._removeHandler);
	}

	protected disconnectedCallback() {
		this._store.removeEventListener(BreakpointStore.Event.DidAddBreakpoint, this._addHandler);
		this._store.removeEventListener(BreakpointStore.Event.DidRemoveBreakpoint, this._removeHandler);
	}

	toggle() {
		this.active = !this.active;
		if (this.active) this._store.addBreakpoint(this.breakpoint);
		else this._store.removeBreakpoint(this.breakpoint);
	}
}

export default BreakpointButton;
