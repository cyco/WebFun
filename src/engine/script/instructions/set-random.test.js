import { Instruction } from '/engine/objects';
import * as SetRandom from './set-random';

describeInstruction('SetCounter', (execute, engine) => {
	it('set the current zone\'s random register to the specified value', () => {
		let instruction = new Instruction({});
		instruction._opcode = SetRandom.Opcode;
		instruction._arguments = [5];

		execute(instruction);
		expect(engine.currentZone.random).toBe(5);
	});
});
