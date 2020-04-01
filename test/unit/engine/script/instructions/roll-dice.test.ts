import RollDice from "src/engine/script/instructions/roll-dice";

describeInstruction("RollDice", (execute, engine) => {
	it("set the current zone's random register to a random() % arg", async () => {
		const instruction: any = {};
		instruction.opcode = RollDice.Opcode;
		instruction.arguments = [5];

		for (let i = 0; i < 10; i++) {
			await execute(instruction);
			expect(engine.currentZone.random).not.toBeGreaterThan(5);
		}
	});
});
