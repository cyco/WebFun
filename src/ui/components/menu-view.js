import Component from "../component";
import Menu from "../menu";
import { Separator } from "../menu-item";
import MenuItem from "./menu-item";
import MenuItemSeparator from "./menu-item-separator";
import "./menu-view.scss";

export default class MenuView extends Component {
	static get TagName() {
		return "wf-menu-view";
	}

	constructor() {
		super();

		this._menu = null;
	}

	connectedCallback() {
		this.removeItemNodes();
		this.addItemNodes();
	}

	close() {
		this.remove();
		if (this.onclose instanceof Function)
			this.onclose();
	}

	get menu() {
		return this._menu;
	}

	set menu(menu) {
		if (menu && !(menu instanceof Menu))
			menu = new Menu(menu);

		this._menu = menu;

		if (!this.isConnected) return;
		this.removeItemNodes();
		this.addItemNodes();
	}

	addItemNodes() {
		const self = this;
		this.menu.items.forEach((menuItem) => {
			if (menuItem === Separator || menuItem.isSeparator) self.addSeparatorNode();
			else self.addItemNode(menuItem);
		});
	}

	addItemNode(menuItem) {
		const node = document.createElement(MenuItem.TagName);
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
