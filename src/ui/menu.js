import MenuItem from "./menu-item";

class Menu {
	constructor(items) {
		this._items = items && items.map((item) => item instanceof MenuItem ? item : new MenuItem(item)) || [];
	}

	get items() {
		return this._items;
	}

	set items(items) {
		this._items = items;
	}
}
export default Menu;
