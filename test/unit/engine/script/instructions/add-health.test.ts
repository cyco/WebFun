import AddHealth from "src/engine/script/instructions/add-health";

describeInstruction("AddHealth", (execute, engine) => {
	it("replenishes the hero's health", async () => {
		engine.hero.health = 4;

		const instruction = { opcode: AddHealth.Opcode, arguments: [15] };

		await execute(instruction);
		expect(engine.hero.health).toBe(19);
	});
});
