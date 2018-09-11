import InventoryComponent, { Events as InventoryEvent } from "src/app/ui/inventory";
import InventoryRow from "src/app/ui/inventory-row";
import Inventory from "src/engine/inventory";
import Yoda from "src/engine/yoda";

describeComponent(InventoryComponent, () => {
	let subject;
	beforeEach(() => (subject = render(InventoryComponent)));

	it("renders at least 7 rows", () => {
		expect(subject.querySelectorAll(InventoryRow.tagName).length).toBe(7);
	});

	describe("showing inventory contents", () => {
		let inventory;
		let tileMock = { image: { representation: {} } };

		beforeEach(() => (inventory = new Inventory()));

		it("updates when the inventory is set, replaced or removed", () => {
			inventory.addItem(tileMock);

			subject.inventory = inventory;
			expect(subject.inventory).toBe(inventory);

			let firstRow = subject.querySelector(InventoryRow.tagName);
			expect(firstRow.tile).toBe(tileMock);
			expect(subject.querySelectorAll(InventoryRow.tagName).length).toBe(7);

			// replace with empty inventory
			inventory = new Inventory();
			subject.inventory = inventory;
			firstRow = subject.querySelector(InventoryRow.tagName);
			expect(firstRow.tile).toBeFalsy();

			subject.inventory = null;
			expect(subject.querySelectorAll(InventoryRow.tagName).length).toBe(7);
		});

		it("updates when the inventory changes", () => {
			inventory.addItem(tileMock);

			subject.inventory = inventory;
			let firstRow = subject.querySelector(InventoryRow.tagName);
			expect(firstRow.tile).toBe(tileMock);

			inventory.removeItem(tileMock);
			firstRow = subject.querySelector(InventoryRow.tagName);
			expect(firstRow.tile).toBeFalsy();

			for (let i = 0; i < 10; i++) {
				inventory.addItem(tileMock);
			}
			expect(subject.querySelectorAll(InventoryRow.tagName).length).toBe(10);
		});

		describe("row click handlers", () => {
			it("notifies when an item is clicked", done => {
				let inventory = new Inventory();
				inventory.addItem(mockTile(Yoda.ItemIDs.Locator));
				subject.inventory = inventory;

				subject.addEventListener(InventoryEvent.ItemActivated, e => {
					expect(e.detail.item.id).toBe(Yoda.ItemIDs.Locator);
					expect(e.detail.row).toBe(0);

					done();
				});

				const firstRow = subject.querySelector(InventoryRow.tagName);
				firstRow.dispatchEvent(new MouseEvent("click"));
			});

			describe("are used to place items", () => {
				let tileMock;
				beforeEach(() => {
					tileMock = mockTile(0);
					let inventory = new Inventory();
					inventory.addItem(tileMock);
					subject.inventory = inventory;

					const firstRow = subject.querySelector(InventoryRow.tagName);
					const fakeImageNode = document.createElement("img");
					firstRow.appendChild(fakeImageNode);
					firstRow.dispatchEvent(new MouseEvent("click"));
				});

				it("triggers simple place item events", done => {
					tileMock.getAttribute = () => false;
					subject.addEventListener(InventoryEvent.ItemPlaced, e => done());

					const sessionOverlay = document.querySelector(".modal-session");
					sessionOverlay.dispatchEvent(new MouseEvent("mouseup"));
				});
			});
		});
	});

	function mockTile(id) {
		return { id, image: { representation: {} } };
	}
});
