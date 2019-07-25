import { Instruction, Tile } from "src/engine/objects";
import RemoveItem from "src/engine/script/instructions/remove-item";

describeInstruction("RemoveItem", (execute, engine) => {
	it("removes an item from the inventory", async () => {
		engine.assetManager.populate(Tile, [null, "fake-tile"]);
		engine.inventory = {
			removeItem() {}
		};

		spyOn(engine.inventory, "removeItem");

		const instruction: any = new Instruction({}) as any;
		instruction._opcode = RemoveItem.Opcode;
		instruction._arguments = [1];

		await execute(instruction);
		expect(engine.inventory.removeItem).toHaveBeenCalledWith("fake-tile");
	});
});
