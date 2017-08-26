import Component from "../component";
import "./menu-item-separator.scss";

export default class extends Component {
	static get TagName() {
		return "wf-menu-item-separator";
	}

	constructor() {
		super();
		this.menu = null;
	}

	connectedCallback() {
		super.connectedCallback();

		this.clear();
		this.appendChild(document.createElement("div"));
	}
}
