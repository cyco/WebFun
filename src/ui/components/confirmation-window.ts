import "./confirmation-window.scss";

import AbstractWindow from "./abstract-window";
import Button from "./button";

class ConfirmationWindow extends AbstractWindow {
	public static readonly tagName = "wf-confirmation-window";
	public static observedAttributes = ["confirm-text", "abort-text"];
	public onconfirm: () => void;
	public onabort: () => void;
	private _confirmButton: Button;
	private _abortButton: Button;
	private _customContent: string | HTMLElement | HTMLDivElement[];

	constructor() {
		super();

		this._confirmButton = document.createElement(Button.tagName) as Button;
		this._confirmButton.onclick = () => this.onconfirm();

		this._abortButton = document.createElement(Button.tagName) as Button;
		this._abortButton.onclick = () => this.onabort();

		this.onclose = () => this.onabort();

		this.title = "WebFun";
	}

	protected connectedCallback(): void {
		const buttons = document.createElement("div");
		buttons.classList.add("buttons");
		buttons.appendChild(this._confirmButton);
		buttons.appendChild(this._abortButton);
		this.content.appendChild(buttons);

		this.onkeydown = (e: KeyboardEvent) => {
			if (e.keyCode === 13) this.onconfirm();
			if (e.keyCode === 27) this.onabort();
			if (e.keyCode !== 13 && e.keyCode !== 27) return;

			e.preventDefault();
			e.stopPropagation();
		};

		if (typeof this._customContent === "string") {
			const label = document.createElement("div");
			label.classList.add("text");
			label.textContent = this._customContent;
			this.content.insertBefore(label, buttons);
		} else if (this._customContent instanceof Array) {
			this._customContent.forEach(c => this.content.insertBefore(c, buttons));
		} else this.content.insertBefore(this._customContent, buttons);

		super.connectedCallback();
	}

	protected disconnectedCallback(): void {
		while (this.content.firstChild) {
			this.content.removeChild(this.content.firstChild);
		}

		this.onkeydown = () => void 0;
		super.disconnectedCallback();
	}

	protected attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		if (attr === "confirm-text") {
			this._confirmButton.setAttribute("label", newValue);
		} else if (attr === "abort-text") {
			this._abortButton.setAttribute("label", newValue);
		} else super.attributeChangedCallback(attr, oldValue, newValue);
	}

	set confirmText(t: string) {
		this.setAttribute("confirm-text", t);
	}

	get confirmText(): string {
		return this.getAttribute("confirm-text");
	}

	set abortText(t: string) {
		this.setAttribute("abort-text", t);
	}

	get abortText(): string {
		return this.getAttribute("abort-text");
	}

	set customContent(c: string | HTMLElement | HTMLDivElement[]) {
		this._customContent = c;
	}

	get customContent(): string | HTMLElement | HTMLDivElement[] {
		return this._customContent;
	}
}

export default ConfirmationWindow;
