import SetCounter from "src/engine/script/instructions/set-counter";

describeInstruction("SetCounter", (execute, engine) => {
	it("set the current zone's counter to the specified value", async () => {
		const instruction: any = {};
		instruction.opcode = SetCounter.Opcode;
		instruction.arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.counter).toBe(2);

		instruction.arguments = [100];
		await execute(instruction);
		expect(engine.currentZone.counter).toBe(100);
	});
});
