import "./abstract-menu-view.scss";

import MenuItem, { Separator } from "../menu-item";

import Component from "../component";
import Menu from "../menu";
import MenuItemComponent from "./menu-item";
import MenuItemSeparator from "./menu-item-separator";

abstract class AbstractMenuView extends Component {
	public onclose: (e: Event) => void = () => void 0;
	private _menu: Menu = null;

	get menu() {
		return this._menu;
	}

	set menu(menu) {
		if (menu && !(menu instanceof Menu)) menu = new Menu(menu);

		this._menu = menu;

		if (!this.isConnected) return;
		this.removeItemNodes();
		this.addItemNodes();
	}

	protected connectedCallback(): void {
		this.removeItemNodes();
		this.addItemNodes();
	}

	close() {
		this.remove();
		if (this.onclose instanceof Function) this.onclose(new CustomEvent("close"));
	}

	addItemNodes() {
		if (!this.menu) return;
		this.menu.items.forEach((menuItem: MenuItem) => {
			if (menuItem === Separator || menuItem.isSeparator) this.addSeparatorNode();
			else this.addItemNode(menuItem);
		});
	}

	addItemNode(menuItem: MenuItem) {
		const node = document.createElement(MenuItemComponent.tagName) as MenuItemComponent;
		node.item = menuItem;
		this.appendChild(node);
		return node;
	}

	addSeparatorNode() {
		const node = document.createElement(MenuItemSeparator.tagName);
		this.appendChild(node);
		return node;
	}

	removeItemNodes() {
		this.textContent = "";
	}
}

export default AbstractMenuView;
