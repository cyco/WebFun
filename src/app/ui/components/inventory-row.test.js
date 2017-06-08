import InventoryRow from './inventory-row';

describeComponent(InventoryRow, () => {
	it('is a row that shows a tile\'s image and name', () => {
		const image = document.createElement('img');
		image.src = 'tile%20image%20data%20url';
		const item = { name: 'Test Item Name', image: { representation: image } };

		const row = render(InventoryRow);
		row.tile = item;

		expect(row.querySelector('img').src).toEndWith('tile%20image%20data%20url');
	});
});
