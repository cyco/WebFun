import Component from "../component";
import "./checkbox.scss";

declare global {
	interface StringConstructor {
		UUID(): string;
	}
}

class Checkbox extends Component {
	private _label: HTMLLabelElement;
	private _box: HTMLInputElement;

	constructor() {
		super();

		const boxID = String.UUID();

		const box = document.createElement("input");
		box.type = "checkbox";
		box.id = boxID;
		this._box = box;

		const label = document.createElement("label");
		label.setAttribute("for", boxID);
		this._label = label;
	}

	static get tagName() {
		return "wf-checkbox";
	}

	get title() {
		return this._label.textContent;
	}

	set title(t) {
		this._label.textContent = "";
		this._label.appendChild(document.createTextNode(t));
	}

	get checked() {
		return this._box.checked;
	}

	set checked(c) {
		this._box.checked = c;
	}

	get onchange() {
		return this._box.onchange;
	}

	set onchange(f) {
		this._box.onchange = f;
	}

	protected connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._box);
		this.appendChild(this._label);
	}

	protected disconnectedCallback() {
		this.textContent = "";

		super.disconnectedCallback();
	}
}

export default Checkbox;
