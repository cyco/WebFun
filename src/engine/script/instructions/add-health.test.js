import { Instruction } from '/engine/objects';
import * as AddHealth from './add-health';

describeInstruction('AddHealth', (execute, engine) => {
	it('replenishes the hero\'s health', () => {
		engine.hero.health = 4;

		let instruction = new Instruction();
		instruction._opcode = AddHealth.Opcode;
		instruction._arguments = [15];

		execute(instruction);
		expect(engine.hero.health).toBe(19);
	});
});

