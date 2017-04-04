import { ModalSession } from '/ux';
import TableView from '/ui/table-view';
import { Event as InventoryEvent } from '/engine/inventory';
import InventoryRow from './inventory-row';
import Yoda from '/engine/yoda';
import { Attribute as TileAttribute, Subtype as TileSubtype } from '/engine/objects/tile';

export const Event = {
	PlacedItem: 'PlacedItem',
	PlacedWeapon: 'PlacedWeapon',
	PlacedConsumeable: 'PlacedConsumeable',
	PlacedLocator: 'PlacedLocator',
	ThrowDetonator: 'ThrowDetonator'
};

export default class InventoryView extends TableView {
	constructor(element) {
		super(element, { selectable: false });

		this._inventory = null;

		this.element.classList.add('inventory-view');

		this.rowClass = InventoryRow;
		while (this.rowCount < this._minRowCount)
			this.addRow(null);
	}

	_rebuildTable() {
		this.clear();

		const self = this;
		this._inventory.forEach((item, rowIdx) => {
			const row = this.addRow(item);
			row.element.onclick = () => self.rowClicked(item, rowIdx);
		});

		while (this.rowCount < this._minRowCount)
			this.addRow(null);
	}

	set inventory(i) {
		if (this._inventory) {
			this._inventory.removeEventListener('itemsDidChange');
		}

		const self = this;
		this._inventory = i;
		this._inventory.addEventListener(InventoryEvent.ItemsDidChange, () => self._rebuildTable());

		this._rebuildTable();
	}

	get inventory() {
		return this._inventory;
	}

	get _minRowCount() {
		return 7;
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

		const element = this.element;
		const imgNode = element.querySelectorAll('.Row')[row].querySelector('img');
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

		console.log('TileAttribute', TileAttribute);
		console.log('TileSubtype', TileSubtype);

		let eventName = Event.PlacedItem;
		if (item.getAttribute(TileAttribute.Weapon)) {
			eventName = Event.PlacedWeapon;
		} else if (item.getAttribute(TileAttribute.Item) &&
			item.getSubtype(TileSubtype.Item.Consumeable)) {
			eventName = Event.PlacedConsumeable;
		}

		this.dispatchEvent(eventName, eventDetail);
	}
}
