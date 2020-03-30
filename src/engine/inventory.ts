import { EventTarget } from "src/util";
import { Tile } from "./objects";
import { Yoda } from "./type";

export const Events = {
	DidAddItem: "ItemAdded",
	DidRemoveItem: "ItemRemoved",
	DidChangeItems: "ItemsChanged"
};

class Inventory extends EventTarget {
	public static readonly Event = Events;
	private _items: Tile[];

	public constructor() {
		super();

		this._items = [];
	}

	public addItem(item: Tile): void {
		let index = this._items.length;
		if (item.id === Yoda.tileIDs.Locator) {
			index = 0;
		}
		this._items.splice(index, 0, item);
		this.dispatchEvent(Events.DidAddItem, { item });
		this.dispatchEvent(Events.DidChangeItems, {
			mode: "add",
			item: item
		});
	}

	public removeAllItems(): void {
		this._items.reverse().forEach(item => this.dispatchEvent(Events.DidRemoveItem, { item }));
		this._items = [];
		this.dispatchEvent(Events.DidChangeItems);
	}

	public removeItem(item: Tile | number): void {
		if (typeof item === "number") {
			item = this._items.find(itm => itm.id === item);
		}

		const index = this._items.indexOf(item);
		if (index === -1) return;

		this._items.splice(index, 1);
		this.dispatchEvent(Events.DidChangeItems, {
			mode: "remove",
			item: item
		});
		this.dispatchEvent(Events.DidRemoveItem, { item });
	}

	public contains(item: Tile | number): boolean {
		if (typeof item === "number") {
			for (let i = 0, len = this._items.length; i < len; i++)
				if (this._items[i].id === item) return true;
		} else {
			return this._items.indexOf(item) !== -1;
		}

		return false;
	}

	public find(predicate: (_: Tile) => boolean): Tile {
		return this._items.find(predicate) || null;
	}

	public forEach(fn: (tile: Tile, index: number, items: Tile[]) => void): void {
		this._items.forEach(fn);
	}

	get items() {
		return this._items.slice();
	}
}

export default Inventory;
