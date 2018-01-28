import Component from "../component";
import Menu from "../menu";
import MenuItem, { Separator } from "../menu-item";
import MenuItemComponent from "./menu-item";
import MenuItemSeparator from "./menu-item-separator";
import "./menu-view.scss";

class MenuView extends Component {
	public static TagName = "wf-menu-view";
	public onclose: Function = null;
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

	connectedCallback() {
		this.removeItemNodes();
		this.addItemNodes();
	}

	close() {
		this.remove();
		if (this.onclose instanceof Function) this.onclose();
	}

	addItemNodes() {
		if (!this.menu) return;
		this.menu.items.forEach((menuItem: MenuItem) => {
			if (menuItem === Separator || menuItem.isSeparator) this.addSeparatorNode();
			else this.addItemNode(menuItem);
		});
	}

	addItemNode(menuItem: MenuItem) {
		const node = <MenuItemComponent>document.createElement(MenuItemComponent.TagName);
		node.item = menuItem;
		this.appendChild(node);
		return node;
	}

	addSeparatorNode() {
		const node = document.createElement(MenuItemSeparator.TagName);
		this.appendChild(node);
		return node;
	}

	removeItemNodes() {
		this.clear();
	}
}

export default MenuView;
