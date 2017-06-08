import InstructionExecutor from '/engine/script/instruction-executor';
import { default as Instruction, Opcode } from '/engine/objects/instruction';
import * as SpeakText from '/engine/script/instructions/speak-text';

describe('InstructionExecutor', () => {
	let executor, engine;
	beforeEach(() => {
		engine = {
			currentZone: {},
			hero: {},
			state: {},
			data: {}
		};

		executor = new InstructionExecutor(engine);
	});

	it('has a function to execute a single instruction', () => {
		expect(typeof executor.execute).toBe('function');
	});
});
