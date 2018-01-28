import { Instruction } from "src/engine/objects";
import EnableNPC from "src/engine/script/instructions/enable-npc";

describeInstruction("EnableNPC", (execute, engine) => {
	it("enables the specified npc in the current zone", async done => {
		engine.currentZone.npcs = [null, null, {}, null];

		let instruction = new Instruction();
		instruction._opcode = EnableNPC.Opcode;
		instruction._arguments = [2];

		await execute(instruction);
		expect(engine.currentZone.npcs[2].enabled).toBeTrue();

		done();
	});
});
