import { Instruction } from "src/engine/objects";
import DisableNPC from "src/engine/script/instructions/disable-npc";

describeInstruction("DisableNPC", (execute, engine) => {
	it("disables the specified npc in the current zone", async () => {
		engine.currentZone.npcs = [null, null, {}, null];

		const instruction: any = new Instruction();
		instruction._opcode = DisableNPC.Opcode;
		instruction._arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.npcs[2].enabled).toBeFalse();
	});

	it("does nothing if the npc doesn't exist", async () => {
		engine.currentZone.npcs = [];

		const instruction: any = new Instruction();
		instruction._opcode = DisableNPC.Opcode;
		instruction._arguments = [2];

		try {
			await execute(instruction);
		} catch (e) {
			expect(false).toBeTrue();
		}
	});
});
