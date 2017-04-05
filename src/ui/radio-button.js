import View from "./view";
export default class RadioButton extends View {
	constructor(title = "", group = null, element = null) {
		super(element || document.createElement("span"));

		this.element.classList.add("Radio");

		const buttonID = String.UUID();
		const radio = document.createElement("input");
		radio.type = "radio";
		radio.id = buttonID;
		this._radio = radio;
		this.element.appendChild(radio);

		const label = document.createElement("label");
		label.append(title);
		label.setAttribute("for", buttonID);
		this._label = label;
		this.element.appendChild(label);

		Object.seal(this);

		if (group) group.addButton(this);
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
;