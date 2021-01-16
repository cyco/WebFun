import "./action.scss";

import { Component } from "src/ui";

export interface ActionDescription {
	name: string;
	icon?: string;
	command: () => void;
}

class Action extends Component {
	static readonly tagName = "wf-zone-editor-action";
	private _action: ActionDescription;

	set action(a: ActionDescription) {
		this._action = a;

		this.title = this._action.name;
		this.className = "fa";
		if (this._action.icon) {
			this.classList.add(this._action.icon);
		}
		this.onclick = () => this._action.command();
	}

	get action(): ActionDescription {
		return this._action;
	}
}

export default Action;
