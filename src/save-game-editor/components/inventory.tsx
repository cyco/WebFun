import { AbstractList } from "src/ui/components";
import InventoryRow from "./inventory-row";
import { Tile } from "src/engine/objects";
import { CSSTileSheet } from "src/editor";
import "./inventory.scss";

export interface InventoryDelegate {
	inventoryDidAddItem(inventory: Inventory): void;
	inventoryDidChangeItem(inventory: Inventory): void;
	inventoryDidRemoveItem(inventory: Inventory): void;
}

class Inventory extends AbstractList<Tile> {
	public static readonly tagName = "wf-save-game-editor-inventory";
	public cell: InventoryRow;
	public delegate: InventoryDelegate;

	constructor() {
		super();
		this.searchDelegate = null;
		this.cell = (
			<InventoryRow
				ondelete={(row: InventoryRow) => this._removeInventoryRow(row)}
				onadd={() => this._addInventoryRow()}
				onchange={() => this.delegate && this.delegate.inventoryDidChangeItem(this)}
			/>
		) as InventoryRow;
	}

	private _addInventoryRow() {
		const tile = this.cell.tiles.find(t => t.name && t.name.length !== 0);
		const rows = Array.from(this.querySelectorAll(InventoryRow.tagName)) as InventoryRow[];
		const items = rows.map(t => t.data);
		items.splice(items.length - 1, 0, tile);
		this.items = items;
		const newRow = this.lastElementChild.lastElementChild as any;
		newRow.scrollIntoViewIfNeeded && newRow.scrollIntoViewIfNeeded(true);

		if (this.delegate) this.delegate.inventoryDidAddItem(this);
	}

	private _removeInventoryRow(row: InventoryRow) {
		const index = this.lastElementChild.children.indexOf(row);
		if (index === -1) return;

		const rows = Array.from(this.querySelectorAll(InventoryRow.tagName)) as InventoryRow[];
		const items = rows.map(t => t.data);
		items.splice(index, 1);
		this.items = items;

		if (this.delegate) this.delegate.inventoryDidRemoveItem(this);
	}

	set tiles(t: Tile[]) {
		this.cell.tiles = t.filter(t => t.name && t.name.length);
	}

	get tiles() {
		return this.cell.tiles;
	}

	set tileSheet(t: CSSTileSheet) {
		this.cell.tileSheet = t;
	}

	get tileSheet() {
		return this.cell.tileSheet;
	}
}
export default Inventory;
