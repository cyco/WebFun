import SetSectorCounter from "src/engine/script/instructions/set-sector-counter";

describeInstruction("SetSectorCounter", (execute, engine) => {
	it("set the current zone's sectorCounter to the specified value", async () => {
		const instruction: any = {};
		instruction.opcode = SetSectorCounter.Opcode;
		instruction.arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.sectorCounter).toBe(2);

		instruction.arguments = [100];
		await execute(instruction);
		expect(engine.currentZone.sectorCounter).toBe(100);
	});
});
