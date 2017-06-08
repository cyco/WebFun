import { Instruction } from '/engine/objects';
import * as MarkAsSolved from './mark-as-solved';

describeInstruction('MarkAsSolved', (execute, engine) => {
	it('marks the current zone as solved', () => {
		let instruction = new Instruction({});
		instruction._opcode = MarkAsSolved.Opcode;
		instruction._arguments = [];
		execute(instruction);
		expect(engine.currentZone.solved).toBeTrue();
	});
});
