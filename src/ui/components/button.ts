import "./button.scss";
import IconButton from "./icon-button";

class Button extends IconButton {
	public static TagName = "wf-button";
	public static observedAttributes = ["label"];

	private _label: HTMLSpanElement;

	constructor() {
		super();

		this._label = document.createElement("span");
	}

	connectedCallback(): void {
		super.connectedCallback();

		this.appendChild(document.createElement("div"));
		this.appendChild(this._label);

		this.attributeChangedCallback("label", this.getAttribute("label"), this.getAttribute("label"));
	}

	attributeChangedCallback(attrName: string, newValue: string, oldValue: string): void {
		if (attrName === "label") {
			this._label.textContent = newValue;
		}

		super.attributeChangedCallback(attrName, newValue, oldValue);
	}
}

export default Button;
