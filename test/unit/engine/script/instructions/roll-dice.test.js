import { Instruction } from "src/engine/objects";
import RollDice from "src/engine/script/instructions/roll-dice";

describeInstruction("SetCounter", (execute, engine) => {
	it("set the current zone's random register to a random() % arg", async (done) => {
		let instruction = new Instruction({});
		instruction._opcode = RollDice.Opcode;
		instruction._arguments = [5];

		for (let i = 0; i < 10; i++) {
			await execute(instruction);
			expect(engine.currentZone.random).not.toBeGreaterThan(5);

			done();
		}
	});
});
