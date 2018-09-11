import Inventory, { Events as InventoryEvent } from "src/engine/inventory";
import { Tile } from "src/engine/objects";
import Yoda from "src/engine/yoda";
import { Component } from "src/ui";
import { Point } from "src/util";
import { ModalSession } from "src/ux";
import InventoryRow from "./inventory-row";
import { Image } from "src/std.dom";
import "./inventory.scss";

export const Events = {
	ItemPlaced: "ItemPlaced",
	ItemActivated: "ItemActivated"
};

const MinRows = 7;

class InventoryComponent extends Component {
	public static Events = Events;
	public static tagName = "wf-inventory";
	private _inventory: Inventory = null;
	private _inventoryChangedHandler: EventListener = () => this._rebuildTable();

	protected connectedCallback() {
		super.connectedCallback();
		this._rebuildTable();
	}

	protected disconnectedCallback() {
		this.textContent = "";
		super.disconnectedCallback();
	}

	private _rebuildTable() {
		this.textContent = "";

		if (this._inventory) {
			this._inventory.forEach((item: Tile, rowIdx: number) => {
				const row = this.addRow(item);
				row.onclick = () => this.rowClicked(item, rowIdx);
			});
		}

		this._fillRows();
	}

	private _fillRows() {
		while (this.rowCount < MinRows) this.addRow(null);
	}

	private rowClicked(item: Tile, row: number) {
		this.dispatchEvent(
			new CustomEvent(Events.ItemActivated, {
				detail: {
					item: item,
					row: row
				}
			})
		);

		if (item.id === Yoda.ItemIDs.Locator) {
			return;
		}

		const imgNode = this.querySelectorAll(InventoryRow.tagName)[row].querySelector("img");
		imgNode.src = Image.blankImage;

		const modalSession = new ModalSession();
		modalSession.onmouseup = () => modalSession.end(0);
		modalSession.onend = () => {
			imgNode.src = item.image.representation.dataURL;
			this._placeItem(item, row, modalSession.lastMouseLocation);
		};
		modalSession.cursor = item.image.representation.dataURL;
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

	public addRow(model: Tile): InventoryRow {
		const row = <InventoryRow tile={model} /> as InventoryRow;
		this.appendChild(row);

		return row;
	}

	get rowCount() {
		return this.querySelectorAll(InventoryRow.tagName).length;
	}

	get inventory() {
		return this._inventory;
	}

	set inventory(i) {
		if (this._inventory) {
			this._inventory.removeEventListener(InventoryEvent.ItemsDidChange, this._inventoryChangedHandler);
		}

		this._inventory = i;

		if (this._inventory) {
			this._inventory.addEventListener(InventoryEvent.ItemsDidChange, this._inventoryChangedHandler);
		}

		this._rebuildTable();
	}
}

export default InventoryComponent;
