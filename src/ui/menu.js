import EventTarget from "/util/event-target";
import MenuItem from "./menu-item";

export default class Menu extends EventTarget {
	constructor(items) {
		super();

		this._items = items && items.map((item) => item instanceof MenuItem ? item : new MenuItem(item)) || [];
	}

	get items() {
		return this._items;
	}
	set items(items) {
		this._items = items;
	}
}
