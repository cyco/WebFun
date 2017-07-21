import { Component } from "/ui";
import { identity } from "/util";
import ToolbarItem from "./toolbar-item";
import "./toolbar.scss";

export default class extends Component {
	static get TagName() {
		return 'wf-editor-toolbar';
	}

	constructor() {
		super();

		this.ontoolchange = null;
	}

	connectedCallback() {
		super.connectedCallback();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}

	addTool(tool) {
		const item = document.createElement(ToolbarItem.TagName);
		item.tool = tool;
		item.onclick = () => this.selectTool(tool);
		this.appendChild(item);
	}

	get tools() {
		return this.children.map(item => item.tool).filter(identity);
	}

	removeTool(tool) {
		const item = this.children.find(item => item.tool === tool);
		if (item) item.remove();
	}

	selectTool(tool) {
		const currentItem = this.querySelector(ToolbarItem.TagName + '[selected]');
		if (currentItem) currentItem.removeAttribute('selected');

		const item = this.children.find(item => item.tool === tool);
		if (item) item.setAttribute('selected', '');

		if (this.ontoolchange instanceof Function) {
			this.ontoolchange(item.tool);
		}
	}
}
