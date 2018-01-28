import { Instruction } from "src/engine/objects";
import DisableNPC from "src/engine/script/instructions/disable-npc";

describeInstruction("DisableNPC", (execute, engine) => {
	it("disables the specified npc in the current zone", async done => {
		engine.currentZone.npcs = [null, null, {}, null];

		let instruction = new Instruction();
		instruction._opcode = DisableNPC.Opcode;
		instruction._arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.npcs[2].enabled).toBeFalse();

		done();
	});
});
