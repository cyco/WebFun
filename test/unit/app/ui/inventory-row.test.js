import InventoryRow from "src/app/ui/inventory-row";
import { Tile } from "src/engine/objects";
import { PaletteView } from "src/editor/components";

describeComponent(InventoryRow, () => {
	it("is a row that shows a tile's image and name", () => {
		const palette = new Uint8Array(0x400);
		const item = { name: "Test Item Name", imageData: new Uint8Array(Tile.WIDTH * Tile.HEIGHT) };

		const row = render(InventoryRow);
		row.palette = palette;
		row.data = item;

		const paletteView = row.querySelector(PaletteView.tagName);
		expect(paletteView.image).toBe(item.imageData);
		expect(paletteView.palette).toBe(palette);
		expect(row.textContent).toContain("Test Item Name");
	});
});
