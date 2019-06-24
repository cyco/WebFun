import { Instruction } from "src/engine/objects";
import AddItem from "src/engine/script/instructions/add-item";
import { Tile } from "src/engine/objects";

describeInstruction("AddItem", (execute, engine) => {
	it("adds an item to the inventory", async () => {
		engine.assetManager.populate(Tile, [null, "fake-tile"]);
		engine.inventory = {
			addItem() {}
		};

		spyOn(engine.inventory, "addItem");

		const instruction = new Instruction({}) as any;
		instruction._opcode = AddItem.Opcode;
		instruction._arguments = [1];

		await execute(instruction);
		expect(engine.inventory.addItem).toHaveBeenCalledWith("fake-tile");
	});
});
