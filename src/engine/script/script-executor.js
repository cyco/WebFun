import ConditionChecker from "./condition-checker";
import InstructionExecutor from "./instruction-executor";

export default class ScriptExecutor {
	constructor() {
		this._engine = null;

		this._checker = new ConditionChecker();
		this._executor = new InstructionExecutor();
	}

	async continueActions(engine) {
		this.engine = engine;
		this._checker.engine = engine;
		this._executor.engine = engine;

		const previousActions = engine.currentZone.actions.filter(
			action => action.instructionPointer);
		return this._evaluateActions(previousActions, false);
	}
	
	async runActions(engine) {
		this.engine = engine;
		this._checker.engine = engine;
		this._executor.engine = engine;

		return this._evaluateActions(engine.currentZone.actions, false);
	}

	_evaluateActions(actions, check = true) {
		const hasActions = actions.length;
		actions = actions.slice();
		while (actions.length) {
			let action = actions.shift();
			if ((!check || this.actionDoesApply(action)) && this.executeInstructions(action))
				return true;
		}

		if (hasActions) {
			this.engine.currentZone.actionsInitialized = true;
			this.engine.state.justEntered = false;
			this.engine.state.enteredByPlane = false;
			this.engine.state.bump = null;
		}

		return false;
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
