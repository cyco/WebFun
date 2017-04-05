import InstructionExecutor from '/engine/script/instruction-executor';
import {default as Instruction, Opcode} from '/engine/objects/instruction';

describe('InstructionExecutor', () => {
	let executor, engine;
	beforeEach(() => {
		engine = {
			state: {
				currentZone: {},
				hero: {}
			}
		};

		executor = new InstructionExecutor(engine);
	});

	it('has a function to execute a single instruction', () => {
		expect(typeof executor.execute).toBe('function');
	});

	describe('opcodes', () => {
		it('Opcode.AddHealth', () => {
			engine.state.hero.health = 4;

			let instruction = new Instruction({});
			instruction._opcode = Opcode.AddHealth;
			instruction._arguments = [15];

			executor.execute(instruction);
			expect(engine.state.hero.health).toBe(19);
		});
	});
});
