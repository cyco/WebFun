import { Instruction } from "src/engine/objects";
import * as AddItem from "src/engine/script/instructions/add-item";

describeInstruction("AddItem", (execute, engine) => {
	it("adds an item to the inventory", async (done) => {
		engine.data.tiles = [null, "fake-tile"];
		engine.inventory = {
			addItem() {
			}
		};

		spyOn(engine.inventory, "addItem");

		let instruction = new Instruction({});
		instruction._opcode = AddItem.Opcode;
		instruction._arguments = [1];

		await execute(instruction);
		expect(engine.inventory.addItem).toHaveBeenCalledWith("fake-tile");

		done();
	});
});

