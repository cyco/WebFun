import ConditionChecker from './condition-checker';
import InstructionExecutor from './instruction-executor';
export default class ActionEvaluator {
	constructor() {
		this._engine = null;

		this._checker = new ConditionChecker();
		this._executor = new InstructionExecutor();
	}

	set engine(e) {
		this._engine = e;
		this._checker.engine = e;
		this._executor.engine = e;
	}

	get engine() {
		return this._engine;
	}

	actionDoesApply(action) {
		return (action.enabled || action.instructionPointer !== 0) && action.conditions.every(
			(condition) => this._checker.check(condition), this);
	}

	executeInstructions(action) {
		this._executor.action = action;
		for (let i = action.instructionPointer | 0, len = action.instructions.length; i < len; i++) {
			action.instructionPointer = i + 1;
			const wait = this._executor.execute(action.instructions[i]);
			if (wait === true) return true;
		}
		this._executor.action = null;
		action.instructionPointer = 0;

		return false;
	}
}