import { Instruction } from "src/engine/objects";
import AddToPadding from "src/engine/script/instructions/add-to-padding";

describeInstruction("AddToPadding", (execute, engine) => {
	it("adds a value to the current zone's padding", async (done) => {
		engine.currentZone.padding = 5;

		let instruction = new Instruction({});
		instruction._opcode = AddToPadding.Opcode;
		instruction._arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.padding).toBe(7);

		instruction._arguments = [-3];
		await execute(instruction);
		expect(engine.currentZone.padding).toBe(4);

		done();
	});
});
