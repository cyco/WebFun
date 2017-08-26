import { Instruction } from "/engine/objects";
import * as AddToCounter from "./add-to-counter";

describeInstruction("AddToCounter", (execute, engine) => {
	it("adds a value to the current zone's counter", () => {
		engine.currentZone.counter = 5;

		let instruction = new Instruction({});
		instruction._opcode = AddToCounter.Opcode;
		instruction._arguments = [2];

		execute(instruction);
		expect(engine.currentZone.counter).toBe(7);

		instruction._arguments = [-3];
		execute(instruction);
		expect(engine.currentZone.counter).toBe(4);
	});
});
