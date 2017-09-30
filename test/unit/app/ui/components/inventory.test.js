import InventoryComponent, { Event as InventoryEvent } from "src/app/ui/components/inventory";
import InventoryRow from "src/app/ui/components/inventory-row";
import Inventory from "src/engine/inventory";
import Yoda from "src/engine/yoda";

describeComponent(InventoryComponent, () => {
	let subject;
	beforeEach(() => subject = render(InventoryComponent));

	it("renders at least 7 rows", () => {
		expect(subject.querySelectorAll(InventoryRow.TagName).length).toBe(7);
	});

	describe("showing inventory contents", () => {
		let inventory = new Inventory();
		let tileMock = {image: {representation: {}}};

		beforeEach(() => {
			inventory = new Inventory();
		});

		it("updates when the inventory is set, replaced or removed", () => {
			inventory.addItem(tileMock);

			subject.inventory = inventory;
			expect(subject.inventory).toBe(inventory);

			let firstRow = subject.querySelector(InventoryRow.TagName);
			expect(firstRow.tile).toBe(tileMock);
			expect(subject.querySelectorAll(InventoryRow.TagName).length).toBe(7);

			// replace with empty inventory
			inventory = new Inventory();
			subject.inventory = inventory;
			firstRow = subject.querySelector(InventoryRow.TagName);
			expect(firstRow.tile).toBeFalsy();

			subject.inventory = null;
			expect(subject.querySelectorAll(InventoryRow.TagName).length).toBe(7);
		});

		it("updates when the inventory changes", () => {
			inventory.addItem(tileMock);

			subject.inventory = inventory;
			let firstRow = subject.querySelector(InventoryRow.TagName);
			expect(firstRow.tile).toBe(tileMock);

			inventory.removeItem(tileMock);
			firstRow = subject.querySelector(InventoryRow.TagName);
			expect(firstRow.tile).toBeFalsy();

			for (let i = 0; i < 10; i++) {
				inventory.addItem(tileMock);
			}
			expect(subject.querySelectorAll(InventoryRow.TagName).length).toBe(10);
		});

		describe("row click handlers", () => {
			it("are used to start the locator", (done) => {
				let inventory = new Inventory();
				inventory.addItem(mockTile(Yoda.ItemIDs.Locator));
				subject.inventory = inventory;

				subject.addEventListener(InventoryEvent.PlacedLocator, (e) => {
					expect(e.detail.item.id).toBe(Yoda.ItemIDs.Locator);
					expect(e.detail.row).toBe(0);

					done();
				});

				const firstRow = subject.querySelector(InventoryRow.TagName);
				firstRow.dispatchEvent(new MouseEvent("click"));
			});


			it("are used to throw thermal detonators", (done) => {
				let inventory = new Inventory();
				inventory.addItem(mockTile(Yoda.ItemIDs.ThermalDetonator));
				subject.inventory = inventory;

				subject.addEventListener(InventoryEvent.ThrowDetonator, (e) => {
					expect(e.detail.item.id).toBe(Yoda.ItemIDs.ThermalDetonator);
					expect(e.detail.row).toBe(0);

					done();
				});

				const firstRow = subject.querySelector(InventoryRow.TagName);
				firstRow.dispatchEvent(new MouseEvent("click"));
			});

			describe("are used to place normal items", () => {
				let tileMock;
				beforeEach(() => {
					tileMock = mockTile(0);
					let inventory = new Inventory();
					inventory.addItem(tileMock);
					subject.inventory = inventory;

					const firstRow = subject.querySelector(InventoryRow.TagName);
					const fakeImageNode = document.createElement("img");
					firstRow.appendChild(fakeImageNode);
					firstRow.dispatchEvent(new MouseEvent("click"));
				});

				it("triggers simple place item events", (done) => {
					tileMock.getAttribute = () => false;
					subject.addEventListener(InventoryEvent.PlacedItem, (e) => {
						done();
					});

					const sessionOverlay = document.querySelector(".modal-session");
					sessionOverlay.dispatchEvent(new MouseEvent("mouseup"));
				});
			});
		});
	});

	function mockTile(id) {
		return {id, image: {representation: {}}};
	}
});
