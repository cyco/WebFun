import {default as Inventory, Event} from '/engine/inventory';

describe('Inventory', () =>  {
	let inventory = null;
	beforeEach(() =>  {
		inventory = new Inventory();
	});

	it('is a class', () =>  {
		expect(typeof Inventory).toBe('function');
	});

	it('items can be added', () =>  {
		let mockItem = {};

		expect(() =>  {
			inventory.addItem(mockItem);
		}).not.toThrow();
	});

	it('items can be removed', () =>  {
		let mockItem = {};

		expect(() =>  {
			inventory.removeItem(mockItem);
		}).not.toThrow();
	});

	it('has method to check if it contains an item', () =>  {
		let mockItem = {
			id: 5
		};
		inventory.addItem(mockItem);

		expect(inventory.contains(mockItem)).toBe(true);
		expect(inventory.contains(5)).toBe(true);

		inventory.removeItem(mockItem);

		expect(inventory.contains(mockItem)).toBe(false);
		expect(inventory.contains(5)).toBe(false);
	});

	it('has a method for easy enumeration', () =>  {
		inventory.addItem({id: 3});
		inventory.addItem({id: 4});
		
		let enumeratedItemIds = [];
		inventory.forEach(function(item) {
			enumeratedItemIds.push(item.id);
		});
		
		expect(enumeratedItemIds).toEqual([3, 4]);
	});
	
	describe('Events', () =>  {
		afterEach(() => {
			inventory.removeEventListener(Event.ItemsDidChange);
		});
		
		it('sends an event when an item is added', (done) => {
			let mockItem = {id: 3};
			inventory.addEventListener(Event.ItemsDidChange, function(event){
				expect(event.detail.mode).toEqual('add');
				expect(event.detail.item).toBe(mockItem);
				
				done();
			});
			inventory.addItem(mockItem);
		});
		
		it('sends an event when an item is removed', (done) => {
			let mockItem = {id: 3};
			inventory.addItem(mockItem);
			
			inventory.addEventListener(Event.ItemsDidChange, function(event){
				expect(event.detail.mode).toEqual('remove');
				expect(event.detail.item).toBe(mockItem);
				
				done();
			});
			
			inventory.removeItem(mockItem);
		});
	});
});
