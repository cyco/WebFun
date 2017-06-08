import View from "./view";
import './textbox.scss';

export default class extends View {
	constructor() {
		super(document.createElement("input"));

		this.element.type = "text";
		this.element.classList.add("textbox");
	}

	set editable(e) {
		if (!e) this.element.setAttribute("readonly", "");
		else this.element.removeAttribute("readonly");
	}

	get editable() {
		return !this.element.hasAttribute("readonly");
	}

	set width(w) {
		this.element.style.width = w + "px";
	}

	get width() {
		return parseInt(this.element.style.width);
	}

	set height(h) {
		this.element.style.height = h + "px";
	}

	get height() {
		return parseInt(this.element.style.height);
	}

	set value(v) {
		this.element.value = v;
	}

	get value() {
		return this.element.value;
	}

	set align(a) {
		this.element.style.textAlign = a;
	}

	get align() {
		return this.element.style.textAlign || "left";
	}

	get onchange() {
		return this.element.onchange;
	}

	set onchange(cb) {
		this.element.onchange = cb;
	}
}
