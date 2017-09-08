import { Instruction } from "src/engine/objects";
import * as AddToPadding from "src/engine/script/instructions/add-to-padding";

describeInstruction("AddToPadding", (execute, engine) => {
	it("adds a value to the current zone's padding", () => {
		engine.currentZone.padding = 5;

		let instruction = new Instruction({});
		instruction._opcode = AddToPadding.Opcode;
		instruction._arguments = [2];

		execute(instruction);
		expect(engine.currentZone.padding).toBe(7);

		instruction._arguments = [-3];
		execute(instruction);
		expect(engine.currentZone.padding).toBe(4);
	});
});
