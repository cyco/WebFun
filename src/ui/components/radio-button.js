import Component from "../component";

export Group from './radio-group';

export default class RadioButton extends Component {
	static get TagName() {
		return 'wf-radio-button';
	}

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

		Object.seal(this);
	}

	connectedCallback() {
		super.conectedCallback();

		this.appendChild(this._radio);
		this.appendChild(this._label);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.clear();
	}

	get title() {
		return this._label.textContent;
	}

	set title(t) {
		this._label.clear();
		this._label.append(t);
	}

	get checked() {
		return this._radio.hasAttribute("checked");
	}

	set checked(c) {
		if (c) this._radio.setAttribute("checked", "");
		else this._radio.removeAttribute("checked");
	}

	set onchange(f) {
		this._radio.onchange = f;
	}

	get onchange() {
		return this._radio.onchange;
	}

	set groupID(id) {
		this._radio.name = id;
	}

	get groupID() {
		return this._radio.name;
	}
}
