import { ResultFlags } from "src/engine/script/arguments";
import Logger from "src/util/logger";
import Point from "src/util/point";
import Engine from "../engine";
import Action from "../objects/action";
import ConditionChecker from "./condition-checker";
import InstructionExecutor from "./instruction-executor";

class ScriptExecutor {
	private _engine: Engine = null;
	private _checker: ConditionChecker = new ConditionChecker();
	private _executor: InstructionExecutor = new InstructionExecutor();

	async continueActions(engine: Engine) {
		this._engine = engine;
		this._checker.engine = engine;
		this._executor.engine = engine;

		const previousActions = engine.currentZone.actions.filter(
			action => action.instructionPointer);
		return this._evaluateActions(previousActions, false);
	}

	async runActions(engine: Engine) {
		this._engine = engine;
		this._checker.engine = engine;
		this._executor.engine = engine;

		return this._evaluateActions(engine.currentZone.actions, false);
	}

	_evaluateActions(actions: Action[], check = true) {
		const hasActions = actions.length;
		actions = actions.slice();
		while (actions.length) {
			let action = actions.shift();
			if ((!check || this.actionDoesApply(action)) && this.executeInstructions(action))
				return true;
		}

		if (hasActions) {
			this._engine.currentZone.actionsInitialized = true;
			this._engine.state.justEntered = false;
			this._engine.state.enteredByPlane = false;
			this._engine.state.bump = null;
		}

		return false;
	}

	actionDoesApply(action: Action): boolean {
		return (action.enabled || action.instructionPointer !== 0) && action.conditions.every(
			(condition) => this._checker.check(condition), this);
	}

	executeInstructions(action: Action): boolean {
		this._executor.action = action;
		for (let i = action.instructionPointer | 0, len = action.instructions.length; i < len; i++) {
			action.instructionPointer = i + 1;
			const result = this._executor.execute(action.instructions[i]);
			if ((result & ResultFlags.Wait)) {
				return true;
			}
		}
		this._executor.action = null;
		action.instructionPointer = 0;
		return false;
	}

	public bump(location: Point) {
		// TODO: implement?
	}
}

export default ScriptExecutor;
