import { Instruction } from "/engine/objects";
import * as RollDice from "./roll-dice";

describeInstruction("SetCounter", (execute, engine) => {
	it("set the current zone's random register to a random() % arg", () => {
		let instruction = new Instruction({});
		instruction._opcode = RollDice.Opcode;
		instruction._arguments = [5];

		for (let i = 0; i < 10; i++) {
			execute(instruction);
			expect(engine.currentZone.random).not.toBeGreaterThan(5);
		}
	});
});
