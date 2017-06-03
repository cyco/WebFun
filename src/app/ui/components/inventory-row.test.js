import InventoryRow from '/app/ui/components/inventory-row';

xdescribe("InventoryRow", () => {
	it('is a row that shows a tile\'s image and name', () => {
		const item = { name: 'Test Item Name', image: { dataURL: 'tile image data url' } };

		const row = new InventoryRow();
		row.setData(item);

		expect(row.element.querySelector('img').src).toBe('tile image data url');
	});
});
