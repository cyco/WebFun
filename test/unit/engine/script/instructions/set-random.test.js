import { Instruction } from "src/engine/objects";
import * as SetRandom from "src/engine/script/instructions/set-random";

describeInstruction("SetCounter", (execute, engine) => {
	it("set the current zone's random register to the specified value", () => {
		let instruction = new Instruction({});
		instruction._opcode = SetRandom.Opcode;
		instruction._arguments = [5];

		execute(instruction);
		expect(engine.currentZone.random).toBe(5);
	});
});
