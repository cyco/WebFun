import { Events, default as Inventory } from "src/engine/inventory";
import { Yoda } from "src/engine";

describe("Inventory", () => {
	let subject = null;
	beforeEach(() => {
		subject = new Inventory();
	});

	it("is a class", () => {
		expect(typeof Inventory).toBe("function");
	});

	it("items can be added", () => {
		const mockItem = {};

		expect(() => subject.addItem(mockItem)).not.toThrow();
	});

	it("items can be removed", () => {
		const mockItem = {};

		expect(() => {
			subject.removeItem(mockItem);
		}).not.toThrow();
	});

	it("has method to check if it contains an item", () => {
		const mockItem = { id: 5 };
		subject.addItem({ id: 10 });
		subject.addItem(mockItem);

		expect(subject.contains(mockItem)).toBeTrue();
		expect(subject.contains(5)).toBeTrue();

		subject.removeItem(mockItem);

		expect(subject.contains(mockItem)).toBeFalse();
		expect(subject.contains(5)).toBeFalse();
	});

	it("can return the first item satisfying a given predicated", () => {
		const mockItem = { id: 10 };
		subject.addItem(mockItem);

		expect(subject.find(tile => tile.id > 5)).toBe(mockItem);
		expect(subject.find(tile => tile.id < 5)).toBe(null);
	});

	it("has a method to remove all items", () => {
		const mockItem1 = { id: 5 };
		const mockItem2 = { id: 7 };

		subject.addItem(mockItem1);
		subject.addItem(mockItem2);
		let eventFired = false;
		subject.addEventListener(Events.ItemsDidChange, () => (eventFired = true));
		subject.removeAllItems();
		expect(eventFired).toBeTrue();
		expect(subject.contains(mockItem1)).toBeFalse();
		expect(subject.contains(mockItem2)).toBeFalse();
	});

	it("has a method for easy enumeration", () => {
		subject.addItem({ id: 3 });
		subject.addItem({ id: 4 });

		const enumeratedItemIds = [];
		subject.forEach(item => enumeratedItemIds.push(item.id));
		expect(enumeratedItemIds).toEqual([3, 4]);
	});

	it("keeps the locator on top", () => {
		subject.addItem({ id: 3 });
		subject.addItem({ id: 4 });
		subject.addItem({ id: Yoda.ItemIDs.Locator });

		expect(subject._items[0].id).toEqual(Yoda.ItemIDs.Locator);
	});

	describe("Events", () => {
		afterEach(() => {
			subject.removeEventListener(Events.ItemsDidChange);
		});

		it("sends an event when an item is added", done => {
			const mockItem = { id: 3 };
			subject.addEventListener(Events.ItemsDidChange, function(event) {
				expect(event.detail.mode).toEqual("add");
				expect(event.detail.item).toBe(mockItem);

				done();
			});
			subject.addItem(mockItem);
		});

		it("sends an event when an item is removed", done => {
			const mockItem = { id: 3 };
			subject.addItem(mockItem);

			subject.addEventListener(Events.ItemsDidChange, function(event) {
				expect(event.detail.mode).toEqual("remove");
				expect(event.detail.item).toBe(mockItem);

				done();
			});

			subject.removeItem(mockItem);
		});
	});
});
