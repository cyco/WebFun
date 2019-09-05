import "./button.scss";

import AbstractIconButton from "./abstract-icon-button";

class Button extends AbstractIconButton {
	public static readonly tagName = "wf-button";
	public static observedAttributes = ["icon", "label"];

	private _label: HTMLSpanElement = <span style={{ display: "none" }} />;

	protected connectedCallback(): void {
		super.connectedCallback();

		this.appendChild(document.createElement("div"));
		this.appendChild(this._label);

		this.attributeChangedCallback("label", this.getAttribute("label"), this.getAttribute("label"));
	}

	protected attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
		if (attributeName === "label") {
			this._label.textContent = newValue;
			this._label.style.display = this._label.textContent.length ? "" : "none";
		}

		super.attributeChangedCallback(attributeName, oldValue, newValue);
	}

	set label(l: string) {
		this.setAttribute("label", l);
	}

	get label(): string {
		return this.getAttribute("label");
	}
}

export default Button;
