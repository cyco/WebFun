import { Description } from "../../description";
import Button from "./button";
import "./confirmation-window.scss";
import Window from "./window";

class ConfirmationWindow extends Window {
	public static TagName = "wf-confirmation-window";
	public static observedAttributes = ["confirm-text", "abort-text"];
	public onconfirm: () => void;
	public onabort: () => void;
	private _confirmButton: Button;
	private _abortButton: Button;
	private _customContent: string | HTMLElement | HTMLDivElement[];

	constructor() {
		super();

		this._confirmButton = <Button>document.createElement(Button.TagName);
		this._confirmButton.onclick = () => this.onconfirm();

		this._abortButton = <Button>document.createElement(Button.TagName);
		this._abortButton.onclick = () => this.onabort();

		this.onclose = () => this.onabort();

		this.title = Description.Name;
	}

	connectedCallback(): void {
		const buttons = document.createElement("div");
		buttons.classList.add("buttons");
		buttons.appendChild(this._confirmButton);
		buttons.appendChild(this._abortButton);
		this.content.appendChild(buttons);

		if (typeof this._customContent === 'string') {
			const label = document.createElement("div");
			label.classList.add("text");
			label.textContent = this._customContent;
			this.content.insertBefore(label, buttons);
		} else if (this._customContent instanceof Array) {
			this._customContent.forEach(c => this.content.insertBefore(c, buttons));
		} else this.content.insertBefore(this._customContent, buttons);

		super.connectedCallback();
	}

	disconnectedCallback() {
		while (this.content.firstChild) {
			this.content.removeChild(this.content.firstChild);
		}

		super.disconnectedCallback();
	}

	attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		if (attr === "confirm-text") {
			this._confirmButton.setAttribute("label", newValue);
		} else if (attr === "abort-text") {
			this._abortButton.setAttribute("label", newValue);
		} else super.attributeChangedCallback(attr, oldValue, newValue);
	}

	set customContent(c: string | HTMLElement | HTMLDivElement[]) {
		this._customContent = c;
	}

	get customContent() {
		return this._customContent;
	}
}

export default ConfirmationWindow;
