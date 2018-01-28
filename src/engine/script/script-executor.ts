import { ResultFlags } from "src/engine/script/types";
import EvaluationMode from "./evaluation-mode";
import { Point } from "src/util";
import Engine from "../engine";
import Action from "../objects/action";
import ConditionChecker from "./condition-checker";
import InstructionExecutor from "./instruction-executor";
import { ConditionImplementations as Conditions } from "./conditions";
import { InstructionImplementations as Instructions } from "./instructions";

class ScriptExecutor {
	private _engine: Engine = null;
	private _checker: ConditionChecker = new ConditionChecker(Conditions);
	private _executor: InstructionExecutor = new InstructionExecutor(Instructions);

	public set checker(c: ConditionChecker) {
		this._checker = c;
	}

	public set executor(e: InstructionExecutor) {
		this._executor = e;
	}

	continueActions(engine: Engine, mode: EvaluationMode): Promise<Boolean> {
		this._engine = engine;
		this._checker.engine = engine;
		this._executor.engine = engine;

		const previousActions = engine.currentZone.actions.filter(action => action.instructionPointer);
		return this._evaluateActions(previousActions, mode, false);
	}

	runActions(engine: Engine, mode: EvaluationMode): Promise<boolean> {
		this._engine = engine;
		this._checker.engine = engine;
		this._executor.engine = engine;

		return this._evaluateActions(engine.currentZone.actions, mode, true);
	}

	public bump(location: Point) {
		// TODO: implement?
	}

	private async _evaluateActions(actions: Action[], mode: EvaluationMode, check = true): Promise<boolean> {
		const hasActions = actions.length;
		actions = actions.slice();
		while (actions.length) {
			let action = actions.shift();
			if ((!check || (await this.actionDoesApply(action, mode))) && (await this.executeInstructions(action)))
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

	private async actionDoesApply(action: Action, mode: EvaluationMode): Promise<boolean> {
		if (!action.enabled && action.instructionPointer === 0) return false;
		if (action.instructionPointer !== 0) return true;

		for (const condition of action.conditions) {
			if (!await this._checker.check(condition, mode)) {
				return false;
			}
		}

		return true;
	}

	private async executeInstructions(action: Action): Promise<boolean> {
		this._executor.action = action;
		for (let i = action.instructionPointer | 0, len = action.instructions.length; i < len; i++) {
			action.instructionPointer = i + 1;
			const result = await this._executor.execute(action.instructions[i]);
			if (result & ResultFlags.Wait) {
				return true;
			}
			if (result & ResultFlags.UpdateText) {
				return true;
			}
			if (result & ResultFlags.UpdateZone) {
				return true;
			}
		}
		action.instructionPointer = 0;
		this._executor.action = null;
		return false;
	}
}

export default ScriptExecutor;
