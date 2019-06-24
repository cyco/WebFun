import { Instruction } from "src/engine/objects";
import SetSharedCounter from "src/engine/script/instructions/set-shared-counter";

describeInstruction("SetSharedCounter", (execute, engine) => {
	it("set the current zone's sharedCounter to the specified value", async () => {
		const instruction = new Instruction({});
		instruction._opcode = SetSharedCounter.Opcode;
		instruction._arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.sharedCounter).toBe(2);

		instruction._arguments = [100];
		await execute(instruction);
		expect(engine.currentZone.sharedCounter).toBe(100);
	});
});
