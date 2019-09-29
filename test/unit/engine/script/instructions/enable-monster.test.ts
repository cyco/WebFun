import { Instruction } from "src/engine/objects";
import EnableMonster from "src/engine/script/instructions/enable-monster";

describeInstruction("EnableMonster", (execute, engine) => {
	it("enables the specified monster in the current zone", async () => {
		engine.currentZone.monsters = [null, null, {}, null];

		const instruction: any = new Instruction();
		instruction._opcode = EnableMonster.Opcode;
		instruction._arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.monsters[2].enabled).toBeTrue();
	});
	it("does not do anything if the monster can't be found", async () => {
		engine.currentZone.monsters = [];

		const instruction: any = new Instruction();
		instruction._opcode = EnableMonster.Opcode;
		instruction._arguments = [2];

		try {
			await execute(instruction);
			expect(true).toBeTrue();
		} catch (e) {
			expect(false).toBeTrue();
		}
	});
});
