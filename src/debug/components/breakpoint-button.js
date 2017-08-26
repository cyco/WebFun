import "./breakpoint-button.scss";
import { Component } from "/ui";
import BreakpointStore from "../breakpoint-store";

export const Events = {
	DidSet: "DidSet",
	DidUnset: "DidUnset"
};

export default class extends Component {
	static get Event() {
		return Events;
	}

	static get TagName() {
		return "wf-breakpoint-button";
	}

	static get observedAttributes() {
		return ["active"];
	}

	constructor() {
		super();

		this._store = BreakpointStore.sharedStore;
		this.breakpoint = null;
		this._removeHandler = ({detail: {breakpoint}}) => breakpoint === this.breakpoint && (this.active = false);
		this._addHandler = ({detail: {breakpoint}}) => breakpoint === this.breakpoint && (this.active = true);
	}

	connectedCallback() {
		this.onclick = () => this.toggle();
		this.active = this._store.hasBreakpoint(this.breakpoint.id);
		this._store.addEventListener(BreakpointStore.Event.DidAddBreakpoint, this._addHandler);
		this._store.addEventListener(BreakpointStore.Event.DidRemoveBreakpoint, this._removeHandler);
	}

	disconnectedCallback() {
		this._store.removeEventListener(BreakpointStore.Event.DidAddBreakpoint, this._addHandler);
		this._store.removeEventListener(BreakpointStore.Event.DidRemoveBreakpoint, this._removeHandler);
	}

	toggle() {
		this.active = !this.active;
		if (this.active) this._store.addBreakpoint(this.breakpoint);
		else this._store.removeBreakpoint(this.breakpoint);
	}

	set active(flag) {
		if (flag) this.setAttribute("active", "");
		else this.removeAttribute("active");
	}

	get active() {
		return this.hasAttribute("active");
	}
}
