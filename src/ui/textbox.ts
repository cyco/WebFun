import View from "./view";
import "./textbox.scss";

class Textbox extends View {
	constructor() {
		super();

		this.element.type = "text";
		this.element.classList.add("textbox");
	}

	get editable() {
		return !this.element.hasAttribute("readonly");
	}

	set editable(e) {
		if (!e) this.element.setAttribute("readonly", "");
		else this.element.removeAttribute("readonly");
	}

	get width() {
		return parseInt(this.element.style.width);
	}

	set width(w) {
		this.element.style.width = w + "px";
	}

	get height() {
		return parseInt(this.element.style.height);
	}

	set height(h) {
		this.element.style.height = h + "px";
	}

	get value() {
		return this.element.value;
	}

	set value(v) {
		this.element.value = v;
	}

	get align() {
		return this.element.style.textAlign || "left";
	}

	set align(a) {
		this.element.style.textAlign = a;
	}

	get onchange() {
		return this.element.onchange;
	}

	set onchange(cb) {
		this.element.onchange = cb;
	}

	get element(): HTMLInputElement {
		return <HTMLInputElement>super.element;
	}

	protected get tagName() {
		return "input";
	}
}

export default Textbox;
