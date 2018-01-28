import { Instruction } from "src/engine/objects";
import SetRandom from "src/engine/script/instructions/set-random";

describeInstruction("SetCounter", (execute, engine) => {
	it("set the current zone's random register to the specified value", async done => {
		let instruction = new Instruction({});
		instruction._opcode = SetRandom.Opcode;
		instruction._arguments = [5];

		await execute(instruction);
		expect(engine.currentZone.random).toBe(5);

		done();
	});
});
