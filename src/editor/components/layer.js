import { Component } from "/ui";
import { Checkbox } from "/ui/components";
import "./layer.scss";

export default class extends Component {
	static get TagName() {
		return "wf-editor-layer";
	}

	constructor() {
		super();

		this._visiblity = document.createElement(Checkbox.TagName);
		this._visiblity.onchange = () => this.onchange instanceof Function && this.onchange();
		this._label = document.createElement("span");

		this.onchange = null;
		this.onselect = null;
	}

	connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._visiblity);
		this.appendChild(this._label);

		this.onclick = (e) => {
			if (e.target === this || e.target === this._label)
				this.onselect instanceof Function && this.onselect();
			else e.stopImmediatePropagation();
		};
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.clear();
	}

	set name(s) {
		this._label.innerText = s;
	}

	get name() {
		return this._label.innerText;
	}

	set visible(v) {
		this._visiblity.checked = v;
	}

	get visible() {
		return this._visiblity.checked;
	}
}
