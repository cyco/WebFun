import { List } from "src/ui/components";
import InventoryRow from "./inventory-row";
import { Tile } from "src/engine/objects";
import { CSSTileSheet } from "src/editor";
import "./inventory.scss";

class Inventory extends List<Tile> {
	public static TagName: string = "wf-save-game-editor-inventory";
	public cell: InventoryRow;

	constructor() {
		super();
		this.searchDelegate = null;
		this.cell = (
			<InventoryRow
				ondelete={(row: InventoryRow) => this._removeInventoryRow(row)}
				onadd={() => this._addInventoryRow()}
			/>
		) as InventoryRow;
	}

	private _addInventoryRow() {
		const tile = this.cell.tiles.find(t => t.name && t.name.length !== 0);
		const rows = Array.from(this.querySelectorAll(InventoryRow.TagName)) as InventoryRow[];
		const items = rows.map(t => t.data);
		items.splice(items.length - 1, 0, tile);
		this.items = items;
		const newRow = this.lastElementChild.lastElementChild as any;
		newRow.scrollIntoViewIfNeeded && newRow.scrollIntoViewIfNeeded(true);
	}

	private _removeInventoryRow(row: InventoryRow) {
		const index = this.lastElementChild.children.indexOf(row);
		if (index === -1) return;

		const rows = Array.from(this.querySelectorAll(InventoryRow.TagName)) as InventoryRow[];
		const items = rows.map(t => t.data);
		items.splice(index, 1);
		this.items = items;
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
