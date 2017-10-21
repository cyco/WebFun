import { Component } from "src/ui";
import { LocationBreakpoint } from "../breakpoint";
import BreakpointButton from "./breakpoint-button";

export default class extends Component {
	static get TagName() {
		console.assert(false, "TagName for abstract instruction-thing component must be overwritten");
		return "";
	}

	static get observedAttributes() {
		return ["current"];
	}

	constructor() {
		super();

		this._setUp = false;
		this._breakpointButton = new BreakpointButton();

		this.zone = null;
		this.action = null;
		this.index = null;

		this._title = document.createElement("span");
	}

	connectedCallback() {
		if (this._setUp) return;

		this._breakpointButton.breakpoint = new LocationBreakpoint(this.zone, this.action, this.type, this.index);
		this.appendChild(this._breakpointButton);
		this.appendChild(this._title);

		this._setUp = true;
	}

	attributeChangedCallback(attribute) {
	}

	get current() {
		return this.hasAttribute("current");
	}

	set current(flag) {
		if (flag) this.setAttribute("current", "");
		else this.removeAttribute("current");
	}

	get type() {
		console.assert(false);
		return "";
	}
}
