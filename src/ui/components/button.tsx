import "./button.scss";
import AbstractIconButton from "./abstract-icon-button";

class Button extends AbstractIconButton {
	public static readonly tagName = "wf-button";
	public static observedAttributes = ["icon", "label"];

	private _label: HTMLSpanElement = <span style={{ display: "none" } as CSSStyleDeclaration} />;

	protected connectedCallback(): void {
		super.connectedCallback();

		this.appendChild(document.createElement("div"));
		this.appendChild(this._label);

		this.attributeChangedCallback("label", this.getAttribute("label"), this.getAttribute("label"));
	}

	protected attributeChangedCallback(attrName: string, newValue: string, oldValue: string): void {
		if (attrName === "label") {
			this._label.textContent = newValue;
			this._label.style.display = this._label.textContent.length ? "" : "none";
		}

		super.attributeChangedCallback(attrName, newValue, oldValue);
	}

	set label(l: string) {
		this.setAttribute("label", l);
	}

	get label(): string {
		return this.getAttribute("label");
	}
}

export default Button;
