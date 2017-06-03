import { sandboxed } from 'test-helpers/dom-sandbox';
import Inventory from '/app/ui/components/inventory';

xdescribe('InventoryView', sandboxed(function(sand) {
	it('shows the hero\'s current inventory', () => {
		let view = new Inventory();
	});
}));
