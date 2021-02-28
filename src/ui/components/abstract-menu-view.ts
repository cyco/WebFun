import "./abstract-menu-view.scss";

import MenuItem, { Separator } from "../menu-item";

import Component from "../component";
import Menu from "../menu";
import MenuItemComponent from "./menu-item";
import MenuItemSeparator from "./menu-item-separator";

abstract class AbstractMenuView extends Component {
	public onclose: (e: Event) => void = () => void 0;
	private _menu: Menu = null;

	get menu(): Menu {
		return this._menu;
	}

	set menu(menu: Menu) {
		if (menu && !(menu instanceof Menu)) menu = new Menu(menu);

		this._menu = menu;

		if (!this.isConnected) return;
		this.removeItemNodes();
		this.addItemNodes();
	}

	protected connectedCallback(): void {
		super.connectedCallback();
		this.removeItemNodes();
		this.addItemNodes();
	}

	protected disconnectedCallback(): void {
		this.removeItemNodes();
		super.disconnectedCallback();
	}

	close(): void {
		this.remove();
		if (this.onclose instanceof Function) this.onclose(new CustomEvent("close"));
	}

	addItemNodes(): void {
		if (!this.menu) return;
		this.menu.items.forEach((menuItem: MenuItem) => {
			if (menuItem === Separator || menuItem.isSeparator) this.addSeparatorNode();
			else this.addItemNode(menuItem);
		});
	}

	addItemNode(menuItem: MenuItem): MenuItemComponent {
		const node = document.createElement(MenuItemComponent.tagName) as MenuItemComponent;
		node.item = menuItem;
		this.appendChild(node);
		return node;
	}

	addSeparatorNode(): MenuItemSeparator {
		const node = document.createElement(MenuItemSeparator.tagName);
		this.appendChild(node);
		return node;
	}

	removeItemNodes(): void {
		this.textContent = "";
	}
}

export default AbstractMenuView;
