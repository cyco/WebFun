import "./abstract-icon-button.scss";

import Component from "../component";

abstract class AbstractIconButton extends Component {
	public static observedAttributes = ["icon"];
	private _icon: HTMLElement = (<i></i>);
	private _iconName: string;

	get icon() {
		return this._iconName;
	}

	set icon(i: string) {
		this._iconName = i;
		this._icon.className = `fa fa-${i}`;
	}

	get disabled() {
		return this.hasAttribute("disabled");
	}

	set disabled(d: boolean) {
		if (d) this.setAttribute("disabled", "");
		else this.removeAttribute("disabled");
	}

	protected connectedCallback(): void {
		if (!this._icon.parentNode) this.appendChild(this._icon);
	}

	protected attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
		if (attributeName === "icon") {
			this._icon.classList.remove(`fa-${oldValue}`);
			this._icon.classList.add(`fa-${newValue}`);
			this._iconName = newValue;
		}
	}
}

export default AbstractIconButton;
