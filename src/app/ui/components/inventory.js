import { ModalSession } from "/ux";
import { Events as InventoryEvent } from "/engine/inventory";
import InventoryRow from "./inventory-row";
import { Component } from '/ui';
import Yoda from "/engine/yoda";
import { Attribute as TileAttribute, Subtype as TileSubtype } from "/engine/objects/tile";

export const Event = {
	PlacedItem: "PlacedItem",
	PlacedWeapon: "PlacedWeapon",
	PlacedConsumeable: "PlacedConsumeable",
	PlacedLocator: "PlacedLocator",
	ThrowDetonator: "ThrowDetonator"
};

const MinRows = 7;

export default class extends Component {
	static get TagName() {
		return 'wf-inventory';
	}

	constructor() {
		super();

		this._inventory = null;
		this._inventoryChangedHandler = () => this._rebuildTable();
	}

	_rebuildTable() {
		this.clear();

		if (this._inventory) {
			this._inventory.forEach((item, rowIdx) => {
				const row = this.addRow(item);
				row.onclick = () => this.rowClicked(item, rowIdx);
			});
		}

		this.fillRows();
	}

	fillRows() {
		while (this.rowCount < MinRows) this.addRow(null);
	}

	get rowCount() {
		return this.querySelectorAll(InventoryRow.TagName).length;
	}

	set inventory(i) {
		if (this._inventory) {
			this._inventory.removeEventListener(InventoryEvent.ItemsDidChange, this._inventoryChangedHandler);
		}

		this._inventory = i;

		if (this._inventory) {
			this._inventory.addEventListener(InventoryEvent.ItemsDidChange, () => {
				this._inventoryChangedHandler();
			});
		}

		this._rebuildTable();
	}

	get inventory() {
		return this._inventory;
	}

	get _minRowCount() {
		return 7;
	}

	connectedCallback() {
		super.connectedCallback();
		this._rebuildTable();
	}

	rowClicked(item, row) {
		if (item.id === Yoda.Locator) {
			this.dispatchEvent(Event.PlacedLocator, {
				item: item,
				row: row
			});
			return;
		}

		if (item.id === Yoda.ItemIDs.ThermalDetonator) {
			this.dispatchEvent(Event.ThrowDetonator, {
				item: item,
				row: row
			});
			return;
		}

		const imgNode = this.querySelectorAll(InventoryRow.TagName)[row].querySelector("img");
		imgNode.src = Image.blankImage;

		const modalSession = new ModalSession();
		modalSession.onmouseup = () => modalSession.end();
		modalSession.onend = () => {
			imgNode.src = item.image.dataURL;
			this.placeItem(item, row, modalSession.lastMouseLocation);
		};
		modalSession.cursor = item.image.dataURL;
		modalSession.run();
	}

	placeItem(item, row, location) {
		const eventDetail = {
			item: item,
			row: row,
			location: location
		};

		console.log("TileAttribute", TileAttribute);
		console.log("TileSubtype", TileSubtype);

		let eventName = Event.PlacedItem;
		if (item.getAttribute(TileAttribute.Weapon)) {
			eventName = Event.PlacedWeapon;
		} else if (item.getAttribute(TileAttribute.Item) &&
			item.getSubtype(TileSubtype.Item.Consumeable)) {
			eventName = Event.PlacedConsumeable;
		}

		this.dispatchEvent(eventName, eventDetail);
	}

	addRow(model) {
		const row = document.createElement(InventoryRow.TagName);
		row.tile = model;
		this.appendChild(row);

		return row;
	}
}
