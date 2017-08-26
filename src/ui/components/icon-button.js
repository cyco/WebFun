import Component from "../component";
import "./icon-button.scss";

export default class extends Component {
	static get TagName() {
		return "wf-icon-button";
	}

	static get Options() {
		return {extends: "button"};
	}

	static get observedAttributes() {
		return ["icon"];
	}

	constructor(iconName = "") {
		super();

		const icon = document.createElement("i");
		icon.classList.add("fa");
		this._icon = icon;
		this.onclick = null;
		this._clickListener = (e) => this.onclick instanceof Function ? this.onclick(e) : null;

		if (iconName) this.setAttribute("icon", iconName);
	}

	connectedCallback() {
		this._icon.remove();
		this.appendChild(this._icon);
	}

	attributeChangedCallback(attributeName, oldValue, newValue) {
		if (attributeName === "icon") {
			this._icon.classList.remove(`fa-${oldValue}`);
			this._icon.classList.add(`fa-${newValue}`);
		}
	}

	set icon(i) {
		this.setAttribute("icon", i);
	}

	get icon() {
		return this.getAttribute("icon");
	}

	set disabled(d) {
		if (d) this.setAttribute("disabled", "");
		else this.removeAttribute("disabled");
	}

	get disabled() {
		return this.hasAttribute("disabled");
	}
}
