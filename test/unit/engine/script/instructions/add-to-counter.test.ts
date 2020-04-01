import AddToCounter from "src/engine/script/instructions/add-to-counter";

describeInstruction("AddToCounter", (execute, engine) => {
	it("adds a value to the current zone's counter", async () => {
		engine.currentZone.counter = 5;

		let instruction = { opcode: AddToCounter.Opcode, arguments: [2] };

		await execute(instruction);
		expect(engine.currentZone.counter).toBe(7);

		instruction = { opcode: AddToCounter.Opcode, arguments: [-3] };
		await execute(instruction);
		expect(engine.currentZone.counter).toBe(4);
	});
});
