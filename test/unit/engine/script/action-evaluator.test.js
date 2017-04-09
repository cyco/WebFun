import ActionEvaluator from '/engine/script/action-evaluator';

describe("ActionEvaluator", () => {
	let evaluator, engine, action;
	beforeEach(() => {
		engine = {};

		action = {};

		evaluator = new ActionEvaluator();
		evaluator.engine = engine;
	});

	it('has an accessor for the engine property', () => {
		expect(evaluator.engine).toBe(engine);
	});

	describe('actionDoesApply is a function to check if an action should be considered for execution', () => {
		it('returns false for actions that are neither enabled nor have been partly executed ', () => {
			action.enabled = false;
			action.instructionPointer = 0;

			expect(evaluator.actionDoesApply(action)).toBeFalse();
		});

		it('returns true if enabled and all conditions check out', () => {
			action.conditions = [];
			expect(evaluator.actionDoesApply(action)).toBeTrue();
		});

		it('returns true if it has been partly executed and all conditions check out', () => {
			action.enabled = false;
			action.instructionPointer = 1;
			action.conditions = [];
			expect(evaluator.actionDoesApply(action)).toBeTrue();
		});

		it('uses a condition checker to test all conditions', () => {
			const checker = { check() {} };
			evaluator._checker = checker;

			spyOn(checker, 'check').and.returnValue(true);

			action.conditions = ['condition-1', 'condition-2', 'condition-3'];
			expect(evaluator.actionDoesApply(action)).toBeTrue();
			expect(checker.check).toHaveBeenCalledTimes(3);
		});

		it('returns false if one condition check fails', () => {
			const checker = { check() {} };
			evaluator._checker = checker;

			spyOn(checker, 'check').and.returnValue(false);

			action.conditions = ['condition-1', 'condition-2', 'condition-3'];
			expect(evaluator.actionDoesApply(action)).toBeFalse();
		});

		it('stops execution early if one condition fails', () => {
			const checker = { check() {} };
			evaluator._checker = checker;

			spyOn(checker, 'check').and.returnValue(false);

			action.conditions = ['condition-1', 'condition-2', 'condition-3'];
			evaluator.actionDoesApply(action);

			expect(checker.check).toHaveBeenCalledTimes(1);
		});
	});

	describe('execute intructions', () => {
		let executor;
		beforeEach(() => {
			executor = { execute() {} };
			evaluator._executor = executor;
		});

		it('executes all instructions in an action', () => {
			const action = { instructions: ['instruction1', 'instruction2'] };
			spyOn(executor, 'execute');

			evaluator.executeInstructions(action);

			expect(executor.execute).toHaveBeenCalledTimes(2);
		});

		it('starts execution at the instruction pointer', () => {
			const action = { instructions: ['instruction1', 'instruction2'], instructionPointer: 1 };
			spyOn(executor, 'execute');

			evaluator.executeInstructions(action);

			expect(executor.execute).toHaveBeenCalledWith('instruction2');
		});

		it('stops executing instructions when an instruction returns true', () => {
			const action = { instructions: ['instruction1', 'instruction2'], instructionPointer: 0 };
			spyOn(executor, 'execute').and.returnValue(true);

			evaluator.executeInstructions(action);

			expect(executor.execute).toHaveBeenCalledTimes(1);
			expect(action.instructionPointer).toBe(1);
		});
	});
});
