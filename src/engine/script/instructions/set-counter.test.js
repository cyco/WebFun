import { Instruction } from "/engine/objects";
import * as SetCounter from "./set-counter";

describeInstruction("SetCounter", (execute, engine) => {
	it("set the current zone's counter to the specified value", () => {
		let instruction = new Instruction({});
		instruction._opcode = SetCounter.Opcode;
		instruction._arguments = [2];

		execute(instruction);
		expect(engine.currentZone.counter).toBe(2);

		instruction._arguments = [100];
		execute(instruction);
		expect(engine.currentZone.counter).toBe(100);
	});
});
