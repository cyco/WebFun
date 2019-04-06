import "./breakpoint-button.scss";

import { Breakpoint } from "../breakpoint";
import BreakpointStore from "../breakpoint-store";
import { Component } from "src/ui";

export const Events = {
	DidSet: "DidSet",
	DidUnset: "DidUnset"
};

class BreakpointButton extends Component {
	static readonly Event = Events;
	static readonly tagName = "wf-debug-breakpoint-button";
	static readonly observedAttributes = ["active"];
	public breakpoint: Breakpoint = null;
	public store: BreakpointStore = BreakpointStore.sharedStore;
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
		this.active = this.store.hasBreakpoint(this.breakpoint.id);
		this.store.addEventListener(BreakpointStore.Event.DidAddBreakpoint, this._addHandler);
		this.store.addEventListener(BreakpointStore.Event.DidRemoveBreakpoint, this._removeHandler);
	}

	protected disconnectedCallback() {
		this.store.removeEventListener(BreakpointStore.Event.DidAddBreakpoint, this._addHandler);
		this.store.removeEventListener(BreakpointStore.Event.DidRemoveBreakpoint, this._removeHandler);
	}

	toggle() {
		this.active = !this.active;
		if (this.active) this.store.addBreakpoint(this.breakpoint);
		else this.store.removeBreakpoint(this.breakpoint);
	}
}

export default BreakpointButton;
