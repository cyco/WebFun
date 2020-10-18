import "./checkbox.scss";

import Component from "../component";

class Checkbox extends Component {
	public static readonly tagName = "wf-checkbox";
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

	get title(): string {
		return this._label.textContent;
	}

	set title(t: string) {
		this._label.textContent = "";
		this._label.appendChild(document.createTextNode(t));
	}

	get checked(): boolean {
		return this._box.checked;
	}

	set checked(c: boolean) {
		this._box.checked = c;
	}

	get onchange(): (_: Event) => void {
		return this._box.onchange;
	}

	set onchange(f: (_: Event) => void) {
		this._box.onchange = f;
	}

	protected connectedCallback(): void {
		super.connectedCallback();

		this.appendChild(this._box);
		this.appendChild(this._label);
	}

	protected disconnectedCallback(): void {
		this.textContent = "";

		super.disconnectedCallback();
	}
}

export default Checkbox;
