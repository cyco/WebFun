import { Instruction } from '/engine/objects';
import * as LoseGame from './lose-game';

describeInstruction('LoseGame', (execute, engine) => {
	it('ends the current story by losing', () => {
		let instruction = new Instruction({});
		instruction._opcode = LoseGame.Opcode;
		instruction._arguments = [0, 1, 2, 3, 4];

		expect(() => execute(instruction)).toThrow("Game Lost!");
	});
});
