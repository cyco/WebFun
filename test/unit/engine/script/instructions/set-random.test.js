import { Instruction } from "src/engine/objects";
import SetRandom from "src/engine/script/instructions/set-random";

describeInstruction("SetRandom", (execute, engine) => {
	it("set the current zone's random register to the specified value", async () => {
		const instruction = new Instruction({});
		instruction._opcode = SetRandom.Opcode;
		instruction._arguments = [5];

		await execute(instruction);
		expect(engine.currentZone.random).toBe(5);
	});
});
