import Inventory, { Events as InventoryEvent } from "src/engine/inventory";
import { Tile, TileAttribute, TileSubtype } from "src/engine/objects";
import Yoda from "src/engine/yoda";
import { Component } from "src/ui";
import { Point } from "src/util";
import { ModalSession } from "src/ux";
import InventoryRow from "./inventory-row";
import "./inventory.scss";

export const Event = {
	PlacedItem: "PlacedItem",
	PlacedWeapon: "PlacedWeapon",
	PlacedConsumeable: "PlacedConsumeable",
	PlacedLocator: "PlacedLocator",
	ThrowDetonator: "ThrowDetonator"
};

const MinRows = 7;

class InventoryComponent extends Component {
	public static TagName = "wf-inventory";
	private _inventory: Inventory;
	private _inventoryChangedHandler: EventListener;

	constructor() {
		super();

		this._inventory = null;
		this._inventoryChangedHandler = () => this._rebuildTable();
	}

	get rowCount() {
		return this.querySelectorAll(InventoryRow.TagName).length;
	}

	get inventory() {
		return this._inventory;
	}

	set inventory(i) {
		if (this._inventory) {
			this._inventory.removeEventListener(
				InventoryEvent.ItemsDidChange,
				this._inventoryChangedHandler
			);
		}

		this._inventory = i;

		if (this._inventory) {
			this._inventory.addEventListener(
				InventoryEvent.ItemsDidChange,
				this._inventoryChangedHandler
			);
		}

		this._rebuildTable();
	}

	_rebuildTable() {
		this.clear();

		if (this._inventory) {
			this._inventory.forEach((item: Tile, rowIdx: number) => {
				const row = this.addRow(item);
				row.onclick = () => this.rowClicked(item, rowIdx);
			});
		}

		this.fillRows();
	}

	fillRows() {
		while (this.rowCount < MinRows) this.addRow(null);
	}

	protected connectedCallback() {
		super.connectedCallback();
		this._rebuildTable();
	}

	rowClicked(item: Tile, row: number) {
		if (item.id === Yoda.ItemIDs.Locator) {
			this.dispatchEvent(
				new CustomEvent(Event.PlacedLocator, {
					detail: {
						item: item,
						row: row
					}
				})
			);
			return;
		}

		if (item.id === Yoda.ItemIDs.ThermalDetonator) {
			this.dispatchEvent(
				new CustomEvent(Event.ThrowDetonator, {
					detail: {
						item: item,
						row: row
					}
				})
			);
			return;
		}

		const imgNode = this.querySelectorAll(InventoryRow.TagName)[row].querySelector("img");
		imgNode.src = (<any>Image).blankImage;

		const modalSession = new ModalSession();
		modalSession.onmouseup = () => modalSession.end(0);
		modalSession.onend = () => {
			imgNode.src = (<any>item.image).dataURL;
			this.placeItem(item, row, modalSession.lastMouseLocation);
		};
		modalSession.cursor = (<any>item.image).dataURL;
		modalSession.run();
	}

	placeItem(item: Tile, row: number, location: Point) {
		const eventDetail = {
			item: item,
			row: row,
			location: location
		};

		let eventName = Event.PlacedItem;
		if (item.getAttribute(TileAttribute.Weapon)) {
			eventName = Event.PlacedWeapon;
		} else if (
			item.getAttribute(TileAttribute.Item) &&
			item.getSubtype(TileSubtype.Item.Consumeable)
		) {
			eventName = Event.PlacedConsumeable;
		}

		this.dispatchEvent(new CustomEvent(eventName, { detail: eventDetail }));
	}

	addRow(model: Tile) {
		const row = <InventoryRow>document.createElement(InventoryRow.TagName);
		row.tile = model;
		this.appendChild(row);

		return row;
	}
}

export default InventoryComponent;
