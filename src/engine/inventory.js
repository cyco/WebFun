import { EventTarget } from "/util";

export const Event = {
	ItemsDidChange: "ItemsDidChange"
};

export default class Inventory extends EventTarget {
	constructor() {
		super();
		this._items = [];
	}

	addItem(item) {
		this._items.push(item);
		this.dispatchEvent(Event.ItemsDidChange, {
			mode: "add",
			item: item
		});
	}

	removeItem(item) {
		const index = this._items.indexOf(item);
		if (index === -1) return;

		this._items.splice(index, 1);
		this.dispatchEvent(Event.ItemsDidChange, {
			mode: "remove",
			item: item
		});
	}

	contains(item) {
		if (typeof item === "number") {
			for (let i = 0, len = this._items.length; i < len; i++)
				if (this._items[i].id === item) return true;
		} else {
			return this._items.indexOf(item) !== -1;
		}

		return false;
	}

	forEach(fn) {
		return this._items.forEach(fn);
	}
}
