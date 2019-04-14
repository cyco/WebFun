import { Events, default as Inventory } from "src/engine/inventory";
import { Yoda } from "src/engine";

describe("Inventory", () => {
	let inventory = null;
	beforeEach(() => {
		inventory = new Inventory();
	});

	it("is a class", () => {
		expect(typeof Inventory).toBe("function");
	});

	it("items can be added", () => {
		let mockItem = {};

		expect(() => {
			inventory.addItem(mockItem);
		}).not.toThrow();
	});

	it("items can be removed", () => {
		let mockItem = {};

		expect(() => {
			inventory.removeItem(mockItem);
		}).not.toThrow();
	});

	it("has method to check if it contains an item", () => {
		let mockItem = {
			id: 5
		};
		inventory.addItem({
			id: 10
		});
		inventory.addItem(mockItem);

		expect(inventory.contains(mockItem)).toBeTrue();
		expect(inventory.contains(5)).toBeTrue();

		inventory.removeItem(mockItem);

		expect(inventory.contains(mockItem)).toBeFalse();
		expect(inventory.contains(5)).toBeFalse();
	});

	it("has a method to remove all items", () => {
		let mockItem1 = {
			id: 5
		};
		let mockItem2 = {
			id: 7
		};
		inventory.addItem(mockItem1);
		inventory.addItem(mockItem2);
		let eventFired = false;
		inventory.addEventListener(Events.ItemsDidChange, () => (eventFired = true));
		inventory.removeAllItems();
		expect(eventFired).toBeTrue();
		expect(inventory.contains(mockItem1)).toBeFalse();
		expect(inventory.contains(mockItem2)).toBeFalse();
	});

	it("has a method for easy enumeration", () => {
		inventory.addItem({ id: 3 });
		inventory.addItem({ id: 4 });

		let enumeratedItemIds = [];
		inventory.forEach(item => enumeratedItemIds.push(item.id));
		expect(enumeratedItemIds).toEqual([3, 4]);
	});

	it("keeps the locator on top", () => {
		inventory.addItem({ id: 3 });
		inventory.addItem({ id: 4 });
		inventory.addItem({ id: Yoda.ItemIDs.Locator });

		expect(inventory._items[0].id).toEqual(Yoda.ItemIDs.Locator);
	});

	describe("Events", () => {
		afterEach(() => {
			inventory.removeEventListener(Events.ItemsDidChange);
		});

		it("sends an event when an item is added", done => {
			let mockItem = { id: 3 };
			inventory.addEventListener(Events.ItemsDidChange, function(event) {
				expect(event.detail.mode).toEqual("add");
				expect(event.detail.item).toBe(mockItem);

				done();
			});
			inventory.addItem(mockItem);
		});

		it("sends an event when an item is removed", done => {
			let mockItem = { id: 3 };
			inventory.addItem(mockItem);

			inventory.addEventListener(Events.ItemsDidChange, function(event) {
				expect(event.detail.mode).toEqual("remove");
				expect(event.detail.item).toBe(mockItem);

				done();
			});

			inventory.removeItem(mockItem);
		});
	});
});
