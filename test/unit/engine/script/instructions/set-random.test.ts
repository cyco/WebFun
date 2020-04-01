import SetRandom from "src/engine/script/instructions/set-random";

describeInstruction("SetRandom", (execute, engine) => {
	it("set the current zone's random register to the specified value", async () => {
		const instruction: any = {};
		instruction.opcode = SetRandom.Opcode;
		instruction.arguments = [5];

		await execute(instruction);
		expect(engine.currentZone.random).toBe(5);
	});
});
