import "./textbox.scss";

import Component from "../component";

class Textbox extends Component {
	public static readonly tagName = "wf-textbox";
	public static readonly observedAttributes = ["readonly"];
	private _element: HTMLInputElement = document.createElement("input");

	protected connectedCallback(): void {
		super.connectedCallback();
		this._element.type = "text";
		this.appendChild(this._element);
	}

	public focus(): void {
		this._element.focus();
	}

	public select(): void {
		this._element.select();
	}

	get editable(): boolean {
		return !this._element.hasAttribute("readonly");
	}

	set editable(e: boolean) {
		if (!e) this._element.setAttribute("readonly", "");
		else this._element.removeAttribute("readonly");
	}

	get width(): number {
		return parseInt(this._element.style.width);
	}

	set width(w: number) {
		this._element.style.width = w + "px";
	}

	get height(): number {
		return parseInt(this._element.style.height);
	}

	set height(h: number) {
		this._element.style.height = h + "px";
	}

	get value(): string {
		return this._element.value;
	}

	set value(v: string) {
		this._element.value = v;
	}

	get align(): string {
		return this._element.style.textAlign || "left";
	}

	set align(a: string) {
		this._element.style.textAlign = a;
	}

	get onchange(): (this: GlobalEventHandlers, ev: Event) => any {
		return this._element.onchange;
	}

	set onchange(cb: (this: GlobalEventHandlers, ev: Event) => any) {
		this._element.onchange = cb;
	}
}

export default Textbox;
