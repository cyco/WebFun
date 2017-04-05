import View from "./view";
import Menu from "./menu";
import { Separator, State as MenuItemState } from "./menu-item";

export default class MenuView extends View {
	constructor(menu, element) {
		super(element || document.createElement("ul"));

		this.element.classList.add("menu-view");

		if (menu && !(menu instanceof Menu))
			menu = new Menu(menu);
		this.menu = menu;
	}

	close() {
		this.element.remove();
		if (this.onclose && typeof this.onclose === "function")
			this.onclose();
	}

	get menu() {
		return this._menu;
	}

	set menu(menu) {
		this._menu = menu;

		this.removeItemNodes();
		this.addItemNodes();
	}

	addItemNodes() {
		const self = this;
		this.menu.items.forEach((menuItem) => {
			if (menuItem === Separator) self.addSeparatorNode();
			else self.addItemNode(menuItem);
		});
	}

	addItemNode(menuItem) {
		const node = document.createElement("li");
		node.classList.add("menu-item");

		const stateNode = this._makeStateNode(menuItem);
		node.appendChild(stateNode);

		if (menuItem.mnemonic !== undefined) {
			const title = menuItem.title;
			const mnemonicIndex = menuItem.mnemonic;
			const preMnemonic = title.substring(0, mnemonicIndex);
			const mnemonic = title.substring(mnemonicIndex, mnemonicIndex + 1);
			const postMnemonic = title.substring(mnemonicIndex + 1);

			const mnemonicHighlight = document.createElement("span");
			mnemonicHighlight.classList.add("mnemonic");
			mnemonicHighlight.append(mnemonic);

			node.append(preMnemonic);
			node.appendChild(mnemonicHighlight);
			node.append(postMnemonic);
		} else {
			node.append(menuItem.title);
		}

		const stateClass = menuItem.enabled ? "enabled" : "disabled";
		node.classList.add(stateClass);

		if (menuItem.enabled && menuItem.callback)
			node.onmouseup = menuItem.callback;
		this.element.appendChild(node);
		menuItem.element = node;

		return node;
	}

	_makeStateNode(menuItem) {
		const node = document.createElement("span");
		node.classList.add("state");

		let state = menuItem.state;
		if (state === undefined) return node;

		if (typeof state === "function") try {
				state = state();
			} catch (e) {}

		let className = null;
		switch (state) {
			case MenuItemState.On:
				className = "on";
				break;
			case MenuItemState.Off:
				className = "off";
				break;
			case MenuItemState.Mixed:
				className = "mixed";
				break;
			case MenuItemState.None:
				break;
			default:
				break;
		}

		if (className)
			node.classList.add(className);
		return node;

	}

	addSeparatorNode() {
		const node = document.createElement("li");
		node.classList.add("menu-item");
		node.classList.add("separator");

		const line = document.createElement("div");
		node.appendChild(line);

		this.element.appendChild(node);
		return node;
	}

	removeItemNodes() {
		while (this.element.childNodes.length) {
			this.element.childNodes.last().remove();
		}
	}
}
