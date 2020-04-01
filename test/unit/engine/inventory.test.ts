import { Events, default as Inventory } from "src/engine/inventory";
import { Yoda } from "src/engine/type";
import { Tile } from "src/engine/objects";

describe("WebFun.Engine.Inventory", () => {
	let subject: Inventory = null;
	beforeEach(() => {
		subject = new Inventory();
	});

	it("is a class", () => {
		expect(typeof Inventory).toBe("function");
	});

	it("items can be added", () => {
		const mockItem: Tile = {} as any;

		expect(() => subject.addItem(mockItem)).not.toThrow();
	});

	it("items can be removed", () => {
		const mockItem: Tile = {} as any;

		expect(() => {
			subject.removeItem(mockItem);
		}).not.toThrow();
	});

	it("has method to check if it contains an item", () => {
		const mockItem: Tile = { id: 5 } as any;
		subject.addItem(({ id: 10 } as any) as Tile);
		subject.addItem(mockItem);

		expect(subject.contains(mockItem)).toBeTrue();
		expect(subject.contains(5)).toBeTrue();

		subject.removeItem(mockItem);

		expect(subject.contains(mockItem)).toBeFalse();
		expect(subject.contains(5)).toBeFalse();
	});

	it("can return the first item satisfying a given predicated", () => {
		const mockItem: Tile = { id: 10 } as any;
		subject.addItem(mockItem);

		expect(subject.find(tile => tile.id > 5)).toBe(mockItem);
		expect(subject.find(tile => tile.id < 5)).toBe(null);
	});

	it("has a method to remove all items", () => {
		const mockItem1: Tile = { id: 5 } as any;
		const mockItem2: Tile = { id: 7 } as any;

		subject.addItem(mockItem1);
		subject.addItem(mockItem2);
		let eventFired = false;
		subject.addEventListener(Events.DidChangeItems, () => (eventFired = true));
		subject.removeAllItems();
		expect(eventFired).toBeTrue();
		expect(subject.contains(mockItem1)).toBeFalse();
		expect(subject.contains(mockItem2)).toBeFalse();
	});

	it("has a method for easy enumeration", () => {
		subject.addItem(({ id: 3 } as any) as Tile);
		subject.addItem(({ id: 4 } as any) as Tile);

		const enumeratedItemIds: number[] = [];
		subject.forEach(item => enumeratedItemIds.push(item.id));
		expect(enumeratedItemIds).toEqual([3, 4]);
	});

	it("keeps the locator on top", () => {
		subject.addItem(({ id: 3 } as any) as Tile);
		subject.addItem(({ id: 4 } as any) as Tile);
		subject.addItem(({ id: Yoda.tileIDs.Locator } as any) as Tile);

		expect((subject as any)._items[0].id).toEqual(Yoda.tileIDs.Locator);
	});

	describe("Events", () => {
		afterEach(() => {
			subject.removeEventListener(Events.DidChangeItems);
		});

		it("sends an event when an item is added", done => {
			const mockItem: Tile = { id: 3 } as any;
			subject.addEventListener(Events.DidChangeItems, function (event: any) {
				expect(event.detail.mode).toEqual("add");
				expect(event.detail.item).toBe(mockItem);

				done();
			});
			subject.addItem(mockItem);
		});

		it("sends an event when an item is removed", done => {
			const mockItem: Tile = { id: 3 } as any;
			subject.addItem(mockItem);

			subject.addEventListener(Events.DidChangeItems, function (event: any) {
				expect(event.detail.mode).toEqual("remove");
				expect(event.detail.item).toBe(mockItem);

				done();
			});

			subject.removeItem(mockItem);
		});
	});
});
