import sandboxed from '../../helpers/dom-sandbox';
import TableView from '/ui/table-view';

describe('TableView', sandboxed(function(sand){
	it('shows a bunch of rows', () => {
		let tableView = new TableView();
		sand.box.appendChild(tableView.element);
	});
}));