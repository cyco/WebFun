import SetSharedCounter from "src/engine/script/instructions/set-shared-counter";

describeInstruction("SetSharedCounter", (execute, engine) => {
	it("set the current zone's sharedCounter to the specified value", async () => {
		const instruction: any = {};
		instruction.opcode = SetSharedCounter.Opcode;
		instruction.arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.sharedCounter).toBe(2);

		instruction.arguments = [100];
		await execute(instruction);
		expect(engine.currentZone.sharedCounter).toBe(100);
	});
});
