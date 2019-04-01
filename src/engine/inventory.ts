import { EventTarget } from "src/util";
import { Tile } from "./objects";
import Yoda from "./yoda";

export const Events = {
	ItemsDidChange: "ItemsDidChange"
};

class Inventory extends EventTarget {
	private _items: Tile[];

	constructor() {
		super();

		this._items = [];

		this.registerEvents(Events);
	}

	addItem(item: Tile): void {
		let index = this._items.length;
		if (item.id === Yoda.ItemIDs.Locator) {
			index = 0;
		}
		this._items.splice(index, 0, item);
		this.dispatchEvent(Events.ItemsDidChange, {
			mode: "add",
			item: item
		});
	}

	removeAllItems(): void {
		this._items = [];
		this.dispatchEvent(Events.ItemsDidChange);
	}

	removeItem(item: Tile | number): void {
		if (typeof item === "number") {
			item = this._items.find(itm => itm.id === item);
		}

		const index = this._items.indexOf(item);
		if (index === -1) return;

		this._items.splice(index, 1);
		this.dispatchEvent(Events.ItemsDidChange, {
			mode: "remove",
			item: item
		});
	}

	contains(item: Tile | number): boolean {
		if (typeof item === "number") {
			for (let i = 0, len = this._items.length; i < len; i++)
				if (this._items[i].id === item) return true;
		} else {
			return this._items.indexOf(item) !== -1;
		}

		return false;
	}

	forEach(fn: (tile: Tile, index: number, items: Tile[]) => void): void {
		this._items.forEach(fn);
	}

	get items() {
		return this._items.slice();
	}
}

export default Inventory;
