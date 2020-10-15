import "./ammo-control.scss";

import { Component } from "src/ui";
import { CustomEvent } from "src/std/dom";

class AmmoControl extends Component implements EventListenerObject {
	public static readonly tagName = "wf-save-game-editor-ammo";
	public static readonly observedAttributes = ["vertical"];
	public continous = true;
	private _value: number = 1;
	private _vertical: boolean = false;
	private _bar: HTMLElement = (<div />);

	protected connectedCallback(): void {
		super.connectedCallback();
		this.appendChild(this._bar);
		this.addEventListener("mousedown", this);
	}

	attributeValueChanged() {
		this.vertical = this.hasAttribute("vertical");
	}

	handleEvent(event: MouseEvent) {
		if (event.type === "mouseup") {
			document.removeEventListener("mousemove", this, { capture: true } as any);
		}

		if (event.type === "mousedown") {
			document.addEventListener("mousemove", this, { capture: true } as any);
			document.addEventListener("mouseup", this, {
				once: true,
				capture: true
			} as any);
		}

		const { clientX, clientY } = event;
		const { left, width, bottom, height } = this.getBoundingClientRect();
		if (this._vertical) {
			this.value = (bottom - clientY) / height;
		} else {
			this.value = (clientX - left) / width;
		}

		if (this.continous || event.type === "mouseup") {
			this.dispatchEvent(new CustomEvent("change", { detail: { value: this.value } }));
		}

		event.stopPropagation();
		event.preventDefault();
	}

	protected disconnectedCallback(): void {
		super.disconnectedCallback();

		this.removeEventListener("mouseup", this);
		document.removeEventListener("mousemove", this, { capture: true } as any);
		document.removeEventListener("mouseup", this, {
			once: true,
			capture: true
		} as any);
	}

	set vertical(flag: boolean) {
		if (this._vertical === flag) return;

		this._vertical = flag;

		if (this._vertical) this.setAttribute("vertical", "");
		else this.removeAttribute("vertical");

		this._bar.style.removeProperty("width");
		this._bar.style.removeProperty("height");
		this.value = this._value;
	}

	get vertical() {
		return this._vertical;
	}

	get value() {
		return this._value;
	}

	set value(value: number) {
		this._value = Math.max(Math.min(value, 1), 0);

		const cssValue = `${100 * this.value}%`;
		if (this._vertical) this._bar.style.height = cssValue;
		else this._bar.style.width = cssValue;
	}
}

export default AmmoControl;
