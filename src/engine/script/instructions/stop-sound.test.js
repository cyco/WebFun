import { Instruction } from '/engine/objects';
import * as StopSound from './stop-sound';

describeInstruction('StopSound', (execute, engine) => {
	it('stops all sounds that are currently playing', () => {
		let instruction = new Instruction({});
		instruction._opcode = StopSound.Opcode;
		instruction._arguments = [];

		expect(() => execute(instruction)).not.toThrow();
	});
});
