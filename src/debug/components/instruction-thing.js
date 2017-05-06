import { Component } from '/ui';
import BreakpointButton from './breakpoint-button';
import { LocationBreakpoint } from '../breakpoint';

export default class extends Component {
	static get TagName() {
		console.assert(false, 'TagName for abstract instruction-thing component must be overwritten');
		return '';
	}

	static get observedAttributes() {
		return ['current'];
	}

	constructor() {
		super();

		this._setUp = false;
		this._breakpointButton = new BreakpointButton();

		this.zone = null;
		this.action = null;
		this.index = null;

		this._title = document.createElement('span');
	}

	connectedCallback() {
		if (this._setUp) return;

		this._breakpointButton.breakpoint = new LocationBreakpoint(this.zone, this.action, this.type, this.index);
		this.appendChild(this._breakpointButton);
		this.appendChild(this._title);

		this._setUp = true;
	}

	attributeChangedCallback(attribute) {}

	set current(flag) {
		if (flag) this.setAttribute('current', '');
		else this.removeAttribute('current');
	}

	get current() {
		return this.hasAttribute('current');
	}

	get type() {
		console.assert(false);
		return '';
	}
}
