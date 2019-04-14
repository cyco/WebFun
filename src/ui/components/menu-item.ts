import "./menu-item.scss";

import Component from "../component";
import MenuItem from "src/ui/menu-item";
import MenuItemState from "src/ui/menu-item-state";

class MenuItemComponent extends Component {
	public static readonly tagName = "wf-menu-item";
	private _item: MenuItem = null;

	get item() {
		return this._item;
	}

	set item(i) {
		if (this._item) this._reset();
		this._item = i;
		if (this._item) this._rebuild();
	}

	private _reset() {
		this.onmouseup = null;
	}

	connectedCallback() {
		super.connectedCallback();
		this._rebuild();
	}

	private _rebuild() {
		this.textContent = "";
		const item: Partial<MenuItem> = this.item || {};

		const stateNode = document.createElement("span");
		stateNode.classList.add("state");
		this.appendChild(stateNode);

		const state = this.evaluate(item.state, MenuItemState.Off);
		this._reflectState(state);

		const enabled = this.evaluate<boolean>(item.enabled, true);
		if (enabled) this.removeAttribute("disabled");
		else this.setAttribute("disabled", "");

		const title = this.buildTitle(item.title, item.mnemonic);
		title.classList.add("title");
		this.appendChild(title);

		if (item.submenu) {
			this.setAttribute("submenu", "");
			this._buildSubmenuIndicator();
		} else {
			this.removeAttribute("submenu");
		}
	}

	private _buildSubmenuIndicator() {
		const submenuIndicator = document.createElement("span");
		submenuIndicator.classList.add("submenu");
		const icon = document.createElement("i");
		icon.classList.add("fa");
		icon.classList.add("fa-caret-right");
		submenuIndicator.appendChild(icon);
		this.appendChild(submenuIndicator);
	}

	private buildTitle(t: string | (() => string), mnemonicIndex: number) {
		const title = this.evaluate(t, "");
		const titleNode = document.createElement("span");

		if (mnemonicIndex === undefined) {
			titleNode.innerText = title;
			return titleNode;
		}

		const preMnemonic = title.substring(0, mnemonicIndex);
		const mnemonic = title.substring(mnemonicIndex, mnemonicIndex + 1);
		const postMnemonic = title.substring(mnemonicIndex + 1);

		const mnemonicHighlight = document.createElement("span");
		mnemonicHighlight.classList.add("mnemonic");
		mnemonicHighlight.appendChild(document.createTextNode(mnemonic));

		titleNode.appendChild(document.createTextNode(preMnemonic));
		titleNode.appendChild(mnemonicHighlight);
		titleNode.appendChild(document.createTextNode(postMnemonic));
		return titleNode;
	}

	private _reflectState(state: MenuItemState) {
		switch (state) {
			case MenuItemState.Mixed:
				this.setAttribute("state", "mixed");
				break;
			case MenuItemState.On:
				this.setAttribute("state", "on");
				break;
			default:
				this.removeAttribute("state");
				break;
		}
	}

	private evaluate<T>(thing: T | (() => T), def: T): T {
		if (thing instanceof Function) {
			return thing();
		}

		return thing !== undefined ? thing : def;
	}
}

export default MenuItemComponent;
