import Component from "../component";
import { State } from "../menu-item";
import "./menu-item.scss";

export default class extends Component {
	static get TagName() {
		return 'wf-menu-item';
	}

	constructor() {
		super();
		this.item = null;
	}

	connectedCallback() {
		super.connectedCallback();

		const menuItem = this.item;

		const stateNode = this._makeStateNode(menuItem);
		this.appendChild(stateNode);


		if (menuItem.mnemonic !== undefined) {
			const title = menuItem.title;
			const mnemonicIndex = menuItem.mnemonic;
			const preMnemonic = title.substring(0, mnemonicIndex);
			const mnemonic = title.substring(mnemonicIndex, mnemonicIndex + 1);
			const postMnemonic = title.substring(mnemonicIndex + 1);

			const mnemonicHighlight = document.createElement("span");
			mnemonicHighlight.classList.add("mnemonic");
			mnemonicHighlight.append(mnemonic);

			this.append(preMnemonic);
			this.appendChild(mnemonicHighlight);
			this.append(postMnemonic);
		} else {
			this.append(menuItem.title);
		}

		const stateClass = menuItem.enabled ? "enabled" : "disabled";
		this.classList.add(stateClass);

		if (menuItem.enabled && menuItem.callback)
			this.onmouseup = menuItem.callback;
	}

	_makeStateNode(menuItem) {
		const node = document.createElement("span");
		node.classList.add("state");

		let state = menuItem.state;
		if (state === undefined) return node;

		if (state instanceof Function) try {
			state = state();
		} catch (e) {
		}

		let className = null;
		switch (state) {
			case State.On:
				className = "on";
				break;
			case State.Off:
				className = "off";
				break;
			case State.Mixed:
				className = "mixed";
				break;
			case State.None:
				break;
			default:
				break;
		}

		if (className)
			node.classList.add(className);

		return node;

	}
}
