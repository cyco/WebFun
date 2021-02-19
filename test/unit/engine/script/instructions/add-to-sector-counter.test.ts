import AddToSectorCounter from "src/engine/script/instructions/add-to-sector-counter";

describeInstruction("AddToSectorCounter", (execute, engine) => {
	it("adds a value to the current zone's sectorCounter", async () => {
		engine.currentZone.sectorCounter = 5;

		let instruction = { opcode: AddToSectorCounter.Opcode, arguments: [2] };

		await execute(instruction);
		expect(engine.currentZone.sectorCounter).toBe(7);

		instruction = { opcode: AddToSectorCounter.Opcode, arguments: [-3] };
		await execute(instruction);
		expect(engine.currentZone.sectorCounter).toBe(4);
	});
});
