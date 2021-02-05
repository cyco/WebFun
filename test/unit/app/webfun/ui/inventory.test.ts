import InventoryComponent, { Events as InventoryEvent } from "src/app/webfun/ui/inventory";
import InventoryRow from "src/app/webfun/ui/inventory-row";
import Inventory from "src/engine/inventory";
import { Yoda } from "src/engine/type";
import { Tile } from "src/engine/objects";

describeComponent(InventoryComponent, () => {
	let subject: InventoryComponent;
	beforeEach(() => (subject = render(InventoryComponent)));
	afterEach(() => subject.remove());

	it("renders at least 7 rows", () => {
		expect(subject.querySelectorAll(InventoryRow.tagName).length).toBeGreaterThanOrEqualTo(7);
	});

	xdescribe("showing inventory contents", () => {
		let inventory: Inventory;
		const tileMock: Tile = { image: { representation: {} } } as any;

		beforeEach(() => (inventory = new Inventory()));

		it("updates when the inventory is set, replaced or removed", () => {
			inventory.addItem(tileMock);

			subject.inventory = inventory;
			expect(subject.inventory).toBe(inventory);

			let firstRow: InventoryRow = subject.querySelector(InventoryRow.tagName) as any;
			expect(firstRow.data).toBe(tileMock);
			expect(subject.querySelectorAll(InventoryRow.tagName).length).toBe(7);

			// replace with empty inventory
			inventory = new Inventory();
			subject.inventory = inventory;
			firstRow = subject.querySelector(InventoryRow.tagName) as any;
			expect(firstRow.data).toBeFalsy();

			subject.inventory = null;
			expect(subject.querySelectorAll(InventoryRow.tagName).length).toBe(7);
		});

		it("updates when the inventory changes", () => {
			inventory.addItem(tileMock);

			subject.inventory = inventory;
			let firstRow: InventoryRow = subject.querySelector(InventoryRow.tagName) as any;
			expect(firstRow.data).toBe(tileMock);

			inventory.removeItem(tileMock);
			firstRow = subject.querySelector(InventoryRow.tagName);
			expect(firstRow.data).toBeFalsy();

			for (let i = 0; i < 10; i++) {
				inventory.addItem(tileMock);
			}
			expect(subject.querySelectorAll(InventoryRow.tagName).length).toBe(10);
		});

		describe("row click handlers", () => {
			it("notifies when an item is clicked", done => {
				const inventory = new Inventory();
				inventory.addItem(mockTile(7, Tile.Attributes.Map));
				subject.inventory = inventory;

				subject.addEventListener(InventoryEvent.ItemActivated, (e: any) => {
					expect(e.detail.item.id).toBe(7);
					expect(e.detail.row).toBe(0);

					done();
				});

				const firstRow = subject.querySelector(InventoryRow.tagName);
				console.log(subject.outerHTML);
				firstRow.dispatchEvent(new MouseEvent("click"));
			});

			describe("are used to place items", () => {
				let tileMock, inventory;
				beforeEach(() => {
					tileMock = mockTile(0);
					inventory = new Inventory();
					inventory.addItem(tileMock);
					subject.inventory = inventory;

					const firstRow = subject.querySelector(InventoryRow.tagName);
					console.log(subject.outerHTML);
					firstRow.dispatchEvent(new MouseEvent("click"));
				});

				it("triggers simple place item events", done => {
					if (document.querySelector(".modal-session"))
						console.log(document.querySelector(".modal-session").outerHTML);
					expect(document.querySelector(".modal-session")).toBeNull();

					subject.addEventListener(InventoryEvent.ItemPlaced, done);

					const sessionOverlay = document.querySelector(".modal-session");
					sessionOverlay.dispatchEvent(new MouseEvent("mouseup"));
				});
			});
		});
	});

	function mockTile(id: number, attributes: number = 0): Tile {
		return { id, imageData: new Uint8Array(1), attributes } as any;
	}
});
