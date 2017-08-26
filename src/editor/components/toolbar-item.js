import { Component } from "/ui";
import "./toolbar-item.scss";

export default class extends Component {
	static get TagName() {
		return "wf-editor-toolbar-item";
	}

	constructor() {
		super();

		this._tool = null;
		this._icon = document.createElement("i");
		this._icon.classList.add("fa");

		this._label = document.createElement("span");
	}

	connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._icon);
		this.appendChild(this._label);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}


	set tool(t) {
		this._tool = t;
		this._label.innerText = t ? t.name : "";
		this._icon.className = `fa fa-${t ? t.icon : ""}`;
	}

	get tool() {
		return this._tool;
	}
}
