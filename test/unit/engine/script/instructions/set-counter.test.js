import { Instruction } from "src/engine/objects";
import SetCounter from "src/engine/script/instructions/set-counter";

describeInstruction("SetCounter", (execute, engine) => {
	it("set the current zone's counter to the specified value", async done => {
		const instruction = new Instruction({});
		instruction._opcode = SetCounter.Opcode;
		instruction._arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.counter).toBe(2);

		instruction._arguments = [100];
		await execute(instruction);
		expect(engine.currentZone.counter).toBe(100);

		done();
	});
});
