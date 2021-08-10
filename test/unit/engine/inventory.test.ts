import { Events, default as Inventory } from "src/engine/inventory";
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
		const mockItem: Tile = mockTile({}) as any;

		expect(() => subject.addItem(mockItem)).not.toThrow();
	});

	it("items can be removed", () => {
		const mockItem: Tile = mockTile({}) as any;

		expect(() => {
			subject.removeItem(mockItem);
		}).not.toThrow();
	});

	it("has method to check if it contains an item", () => {
		const mockItem: Tile = mockTile({ id: 5 });
		subject.addItem(mockTile({ id: 10 }));
		subject.addItem(mockItem);

		expect(subject.contains(mockItem)).toBeTrue();
		expect(subject.contains(5)).toBeTrue();

		subject.removeItem(mockItem);

		expect(subject.contains(mockItem)).toBeFalse();
		expect(subject.contains(5)).toBeFalse();
	});

	it("can return the first item satisfying a given predicated", () => {
		const mockItem: Tile = mockTile({ id: 10 });
		subject.addItem(mockItem);

		expect(subject.find(tile => tile.id > 5)).toBe(mockItem);
		expect(subject.find(tile => tile.id < 5)).toBe(null);
	});

	it("has a method to remove all items", () => {
		const mockItem1: Tile = mockTile({ id: 5 });
		const mockItem2: Tile = mockTile({ id: 7 });

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
		subject.addItem(mockTile({ id: 3 }));
		subject.addItem(mockTile({ id: 4 }));

		const enumeratedItemIds: number[] = [];
		subject.forEach(item => enumeratedItemIds.push(item.id));
		expect(enumeratedItemIds).toEqual([3, 4]);
	});

	it("keeps the map on top", () => {
		subject.addItem(mockTile({ id: 3 }));
		subject.addItem(mockTile({ id: 4 }));
		subject.addItem(
			mockTile({
				id: 7,
				attributes: Tile.Attributes.Map
			})
		);

		expect((subject as any)._items[0].id).toEqual(7);
	});

	describe("Events", () => {
		afterEach(() => {
			subject.removeEventListener(Events.DidChangeItems);
		});

		it("sends an event when an item is added", done => {
			const mockItem: Tile = mockTile({ id: 3 });
			subject.addEventListener(Events.DidChangeItems, function (event: any) {
				expect(event.detail.mode).toEqual("add");
				expect(event.detail.item).toBe(mockItem);

				done();
			});
			subject.addItem(mockItem);
		});

		it("sends an event when an item is removed", done => {
			const mockItem: Tile = mockTile({ id: 3 });
			subject.addItem(mockItem);

			subject.addEventListener(Events.DidChangeItems, function (event: any) {
				expect(event.detail.mode).toEqual("remove");
				expect(event.detail.item).toBe(mockItem);

				done();
			});

			subject.removeItem(mockItem);
		});
	});

	function mockTile(spec: any): Tile {
		const tile = new Tile(3, {} as any);
		tile.id = spec.id ?? 0;
		tile.attributes = spec.attributes ?? 0;
		return tile;
	}
});
