import Component from "../component";

import Group from "./radio-group";

export { Group };

class RadioButton extends Component {
	private _radio: HTMLInputElement;
	private _label: HTMLLabelElement;

	constructor() {
		super();

		const buttonID = String.UUID();
		const radio = document.createElement("input");
		radio.type = "radio";
		radio.id = buttonID;
		this._radio = radio;

		const label = document.createElement("label");
		label.setAttribute("for", buttonID);
		this._label = label;
	}

	static get TagName() {
		return "wf-radio-button";
	}

	get title() {
		return this._label.textContent;
	}

	set title(t) {
		this._label.clear();
		this._label.appendChild(document.createTextNode(t));
	}

	get checked() {
		return this._radio.hasAttribute("checked");
	}

	set checked(c) {
		if (c) this._radio.setAttribute("checked", "");
		else this._radio.removeAttribute("checked");
	}

	get onchange() {
		return this._radio.onchange;
	}

	set onchange(f) {
		this._radio.onchange = f;
	}

	get groupID() {
		return this._radio.name;
	}

	set groupID(id) {
		this._radio.name = id;
	}

	protected connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._radio);
		this.appendChild(this._label);
	}

	protected disconnectedCallback() {
		super.disconnectedCallback();
		this.clear();
	}
}

export default RadioButton;
