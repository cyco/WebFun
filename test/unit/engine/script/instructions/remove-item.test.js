import { Instruction } from "src/engine/objects";
import * as RemoveItem from "src/engine/script/instructions/remove-item";

describeInstruction("RemoveItem", (execute, engine) => {
	it("removes an item from the inventory", async (done) => {
		engine.data.tiles = [null, "fake-tile"];
		engine.inventory = {
			removeItem() {
			}
		};

		spyOn(engine.inventory, "removeItem");

		let instruction = new Instruction({});
		instruction._opcode = RemoveItem.Opcode;
		instruction._arguments = [1];

		await execute(instruction);
		expect(engine.inventory.removeItem).toHaveBeenCalledWith("fake-tile");

		done();
	});
});

