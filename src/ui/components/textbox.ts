import Component from "../component";
import "./textbox.scss";

class Textbox extends Component {
	public static readonly tagName = "wf-textbox";
	public static readonly observedAttributes = ["readonly"];
	private _element: HTMLInputElement = document.createElement("input");

	protected connectedCallback() {
		super.connectedCallback();
		this._element.type = "text";
		this.appendChild(this._element);
	}

	public focus() {
		this._element.focus();
	}

	public select() {
		this._element.select();
	}

	get editable() {
		return !this._element.hasAttribute("readonly");
	}

	set editable(e) {
		if (!e) this._element.setAttribute("readonly", "");
		else this._element.removeAttribute("readonly");
	}

	get width() {
		return parseInt(this._element.style.width);
	}

	set width(w) {
		this._element.style.width = w + "px";
	}

	get height() {
		return parseInt(this._element.style.height);
	}

	set height(h) {
		this._element.style.height = h + "px";
	}

	get value() {
		return this._element.value;
	}

	set value(v) {
		this._element.value = v;
	}

	get align() {
		return this._element.style.textAlign || "left";
	}

	set align(a) {
		this._element.style.textAlign = a;
	}

	get onchange() {
		return this._element.onchange;
	}

	set onchange(cb) {
		this._element.onchange = cb;
	}
}

export default Textbox;
