import AddItem from "src/engine/script/instructions/add-item";
import { Tile } from "src/engine/objects";

describeInstruction("AddItem", (execute, engine) => {
	it("adds an item to the inventory", async () => {
		engine.assets.populate(Tile, [null, "fake-tile"]);
		engine.inventory = {
			addItem() {}
		};

		spyOn(engine.inventory, "addItem");

		const instruction = { opcode: AddItem.Opcode, arguments: [1] };

		await execute(instruction);
		expect(engine.inventory.addItem).toHaveBeenCalledWith("fake-tile");
	});
});
