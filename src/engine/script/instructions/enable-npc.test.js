import { Instruction } from '/engine/objects';
import * as EnableNPC from './enable-npc';

describeInstruction('EnableNPC', (execute, engine) => {
	it('enables the specified npc in the current zone', () => {
		engine.currentZone.npcs = [null, null, {}, null];

		let instruction = new Instruction();
		instruction._opcode = EnableNPC.Opcode;
		instruction._arguments = [2];

		execute(instruction);
		expect(engine.currentZone.npcs[2].enabled).toBeTrue();
	});
});

