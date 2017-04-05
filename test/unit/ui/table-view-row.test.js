import sandboxed from '../../helpers/dom-sandbox';
import TableViewRow from '/ui/table-view-row';

describe('TableViewRow', sandboxed(function(sand){
	it('displays a single row of a table view', () => {
		let tableViewRow = new TableViewRow();
		sand.box.appendChild(tableViewRow.element);
	});
}));