import { Instruction } from "src/engine/objects";
import EnableNPC from "src/engine/script/instructions/enable-npc";

describeInstruction("EnableNPC", (execute, engine) => {
	it("enables the specified npc in the current zone", async () => {
		engine.currentZone.npcs = [null, null, {}, null];

		const instruction = new Instruction();
		instruction._opcode = EnableNPC.Opcode;
		instruction._arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.npcs[2].enabled).toBeTrue();
	});
	it("does not do anything if the npc can't be found", async () => {
		engine.currentZone.npcs = [];

		const instruction = new Instruction();
		instruction._opcode = EnableNPC.Opcode;
		instruction._arguments = [2];

		try {
			await execute(instruction);
			expect(true).toBeTrue();
		} catch (e) {
			expect(false).toBeTrue();
		}
	});
});
