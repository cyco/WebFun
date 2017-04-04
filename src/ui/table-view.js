import { KeyEvent } from '/util';
import View from './view';
import TableViewRow from './table-view-row';
import { ViewFocusManager } from '/ux';

export const Event = {
	DidMakeRow: 'TableView.Event',
	SelectionWillChange: 'SelectionWillChange',
	SelectionDidChange: 'SelectionDidChange'
};

export default class TableView extends View {
	static get Event() {
		return Event;
	}

	constructor(element, options = {
		selectable: true,
		allowsEmptySelection: false
	}) {
		super(element);
		this.element.classList.add('TableView');

		if (options.selectable) this._selectable = true;
		if (options.allowsEmptySelection) this._allowsEmptySelection = true;

		const self = this;
		this.element.onmousedown = (e) => self.mouseDown(e);
		this.element.onmouseup = (e) => self.mouseUp(e);
		this.element.onkeydown = (e) => self.keyPress(e);

		this._rows = [];
		this.rowClass = TableViewRow;
		this._selectedRow = null;
	}

	addRow(model) {
		const row = new this.rowClass();
		this.dispatchEvent(TableView.Event, {
			table: this,
			row: row
		});
		row.setData(model);

		this._rows.push(row);
		this.element.appendChild(row.element);

		return row;
	}

	addRows(models) {
		const self = this;
		models.forEach((model) => self.addRow(model));
	}

	insertRow(idx, model) {
		const row = new this.rowClass();
		row.setData(model);

		this._rows.splice(idx, 0, row);
		// TODO:
	}

	removeRow(rowIdx) {
		const rows = this._rows.splice(rowIdx, 1);
		rows.forEach((row) => row.element.remove());
	}

	clear() {
		while (this._rows.length)
			this.removeRow(0);

		this._selectedRow = null;
	}

	get rowCount() {
		return this._rows.length;
	}

	get rowClass() {
		return this._rowClass;
	}

	set rowClass(aClass) {
		this._rowClass = aClass;
	}

	// Interaction
	mouseDown() {
		ViewFocusManager.sharedManager.focusView(this);
	}

	mouseUp(e) {
		if (!this._selectable) return;

		const target = e.target.closest('.Row');
		let newRow = target ? this._rows.findIndex((r) => r.element === target && r.isSelectable) : -1;
		this.selectRow(newRow);
	}

	selectRow(idx) {
		if (!this._selectable) return;

		let newRow = idx === -1 ? null : this._rows[idx];
		const oldRow = this._selectedRow;
		if (oldRow === newRow) return;

		if (!this._allowsEmptySelection && !newRow)
			return;

		this.dispatchEvent(Event.SelectionWillChange, {});

		if (this._selectedRow) this._selectedRow.selected = false;

		if (newRow) {
			this._selectedRow = newRow;
			this._selectedRow.selected = true;
		}

		this.dispatchEvent(Event.SelectionDidChange, {});
	}

	get selectedRow() {
		return this._selectedRow;
	}

	keyPress(e) {
		if (!this._selectable) return;

		let index;
		switch (e.which) {
			case KeyEvent.DOM_VK_UP:
				index = this._rows.indexOf(this._selectedRow) + 1;
				if (!index) index = this._rows.length - 1;
				this.selectRow(Math.min(index, this._rows.length - 1));
				break;
			case KeyEvent.DOM_VK_DOWN:
				index = this._rows.indexOf(this._selectedRow) - 1;
				this.selectRow(Math.max(index, 0));

				break;
			case KeyEvent.DOM_VK_BACK_SPACE:
			case KeyEvent.DOM_VK_DELETE:

				break;
			default:
				break;
		}
	}
}
