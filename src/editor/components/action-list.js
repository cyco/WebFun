import { Component } from "src/ui";
import ActionItem from "./action-item";
import "./action-list.scss";

export default class extends Component {
	static get TagName() {
		return "wf-editor-action-list";
	}

	constructor() {
		super();
	}

	connectedCallback() {
		super.connectedCallback();
	}

	_rebuild() {
		this.clear();

		this._zone.actions.forEach(action => {
			const actionItem = document.createElement(ActionItem.TagName);
			actionItem.zoneId = this._zone.id;
			actionItem.action = action;
			this.appendChild(actionItem);
		});
	}

	get zone() {
		return this._zone;
	}

	set zone(z) {
		this._zone = z;
		this._rebuild();
	}
}
