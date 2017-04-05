import {default as Action, _Action} from '/engine/objects/action';
import Instruction from '/engine/objects/instruction';
import Condition from '/engine/objects/condition';

describe('Action', () =>  {
	let action;
	beforeEach(() => {
		action = new Action();
	});

	it('can have several conditions', () =>  {
		expect(action.conditions).toEqual([]);
	});

	it('can have several instructions', () =>  {
		expect(action.instructions).toEqual([]);
	});

	it('has an instruction pointer that is initially set to 0', () =>  {
		expect(action.instructionPointer).toBe(0);
	});

	it('is initially enabled', () =>  {
		expect(action.enabled).toBe(true);
	});

	describe('_Action', () =>  {
		it('is a common (private) base class for instructions and conditions', () =>  {
			expect(typeof _Action).toBe('function');
		});
	});

	describe('Instruction', () =>  {
		it('extends _Action', () =>  {
			let instruction = new Instruction({});
			expect(instruction instanceof _Action).toBe(true);
		});
		
		it('may have \'additional data\' of arbitrary length (usually text someone speaks)', () => {
			let instruction = new Instruction({});
			instruction._additionalData = 'something someone might say';
			expect(instruction.text).toEqual('something someone might say');
		});
	});
	
	describe('Condition', () =>  {
		it('extends _Action', () =>  {
			let condition = new Condition({});
			expect(condition instanceof _Action).toBe(true);
		});
	});
});
