import MenuItem, { MenuItemInit } from "./menu-item";

class Menu {
	private _items: MenuItem[];

	constructor(items: (MenuItem | Partial<MenuItemInit>)[] = []) {
		const makeMenuItem = (item: MenuItem | Partial<MenuItemInit>): MenuItem =>
			item instanceof MenuItem ? item : new MenuItem(item);
		this._items = items.map(makeMenuItem);
	}

	get items(): MenuItem[] {
		return this._items;
	}

	set items(items: MenuItem[]) {
		this._items = items;
	}
}

export default Menu;
