import Component from "../component";
import "./icon-button.scss";

class IconButton extends Component {
	public static TagName = "wf-icon-button";
	public static Options = {extends: "button"};
	public static observedAttributes = ["icon"];

	private _icon: HTMLElement;

	constructor(iconName = "") {
		super();

		const icon = document.createElement("i");
		icon.classList.add("fa");
		this._icon = icon;
		this.onclick = null;

		if (iconName) this.setAttribute("icon", iconName);
	}

	get icon() {
		return this.getAttribute("icon");
	}

	set icon(i) {
		this.setAttribute("icon", i);
	}

	get disabled() {
		return this.hasAttribute("disabled");
	}

	set disabled(d) {
		if (d) this.setAttribute("disabled", "");
		else this.removeAttribute("disabled");
	}

	connectedCallback() {
		this._icon.remove();
		this.appendChild(this._icon);
	}

	attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
		if (attributeName === "icon") {
			this._icon.classList.remove(`fa-${oldValue}`);
			this._icon.classList.add(`fa-${newValue}`);
		}
	}
}

export default IconButton;
