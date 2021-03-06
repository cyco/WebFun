import "./inventory.scss";

import Inventory, { Events as InventoryEvent } from "src/engine/inventory";

import { AbstractList } from "src/ui/components";
import { ColorPalette } from "src/engine/rendering";
import InventoryRow from "./inventory-row";
import { ModalSession } from "src/ux";
import { Point } from "src/util";
import { Tile } from "src/engine/objects";
import { max } from "src/std/math";

export const Events = {
	ItemPlaced: "ItemPlaced",
	ItemActivated: "ItemActivated"
};

const MinRows = 7;

class InventoryComponent extends AbstractList<Tile> {
	public static readonly tagName = "wf-inventory";
	public static Events = Events;
	public cell = (
		<InventoryRow onclick={(e: MouseEvent) => this.rowClicked(e.currentTarget as InventoryRow)} />
	) as InventoryRow;
	private _inventory: Inventory = null;
	private _inventoryChangedHandler = () => this._rebuildTable();

	protected connectedCallback(): void {
		super.connectedCallback();
		this._rebuildTable();
	}

	private rowClicked(cell: InventoryRow) {
		const row = this._cells.indexOf(cell);
		const item = cell.data;

		const event = new CustomEvent(Events.ItemActivated, {
			detail: { item, row },
			cancelable: true
		});
		if (!this.dispatchEvent(event) || !item || !this._canPlaceItem(item)) {
			return;
		}

		const imageDataURL = cell.imageDataURL;
		cell.pickedUp = true;

		const modalSession = new ModalSession();
		modalSession.onmouseup = () => modalSession.end(0);
		modalSession.onend = () => {
			cell.pickedUp = false;
			this._placeItem(item, row, modalSession.lastMouseLocation);
		};
		modalSession.cursor = imageDataURL;
		modalSession.run();
	}

	private _placeItem(item: Tile, row: number, location: Point) {
		this.dispatchEvent(
			new CustomEvent(Events.ItemPlaced, {
				detail: {
					item: item,
					row: row,
					location: location
				}
			})
		);
	}

	set inventory(i: Inventory) {
		if (this._inventory) {
			this._inventory.removeEventListener(
				InventoryEvent.DidChangeItems,
				this._inventoryChangedHandler
			);
			this.items = Array.Repeat(null, MinRows);
		}

		this._inventory = i;

		if (this._inventory) {
			this._inventory.addEventListener(
				InventoryEvent.DidChangeItems,
				this._inventoryChangedHandler
			);
			this._rebuildTable();
		}
	}

	get inventory(): Inventory {
		return this._inventory;
	}

	private _rebuildTable() {
		const items = this._inventory?.items ?? [];
		this.items = items.concat(...Array.Repeat(null, max(0, MinRows - items.length)));
	}

	private _canPlaceItem(item: Tile): boolean {
		return !item.hasAttributes(Tile.Attributes.Map);
	}

	public set palette(palette: ColorPalette) {
		this._cells.forEach((c: InventoryRow) => (c.palette = palette));
		this.cell.palette = palette;
	}

	public get palette(): ColorPalette {
		return this.cell.palette;
	}
}

export default InventoryComponent;
