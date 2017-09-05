import IconButton from "./icon-button";
import "./button.scss";

export default class extends IconButton {
	static get TagName() {
		return "wf-button";
	}

	static get observedAttributes() {
		return [ "label" ];
	}

	constructor() {
		super();

		this._label = document.createElement("span");
	}

	connectedCallback() {
		super.connectedCallback();

		this.appendChild(document.createElement("div"));
		this.appendChild(this._icon);
		this.appendChild(this._label);

		this.attributeChangedCallback("label", this.getAttribute("label"), this.getAttribute("label"));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}

	attributeChangedCallback(attrName, newValue, oldValue) {
		if (attrName === "label") {
			this._label.textContent = newValue;
		}

		super.attributeChangedCallback(attrName, newValue, oldValue);
	}
}
