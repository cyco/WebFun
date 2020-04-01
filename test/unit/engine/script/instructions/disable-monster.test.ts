import DisableMonster from "src/engine/script/instructions/disable-monster";

describeInstruction("DisableMonster", (execute, engine) => {
	it("disables the specified monster in the current zone", async () => {
		engine.currentZone.monsters = [null, null, {}, null];

		const instruction: any = {};
		instruction.opcode = DisableMonster.Opcode;
		instruction.arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.monsters[2].enabled).toBeFalse();
	});

	it("does nothing if the monster doesn't exist", async () => {
		engine.currentZone.monsters = [];

		const instruction: any = {};
		instruction.opcode = DisableMonster.Opcode;
		instruction.arguments = [2];

		try {
			await execute(instruction);
		} catch (e) {
			expect(false).toBeTrue();
		}
	});
});
