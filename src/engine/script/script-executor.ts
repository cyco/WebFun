import { ResultFlags } from "src/engine/script/arguments";
import Point from "src/util/point";
import Engine from "../engine";
import Action from "../objects/action";
import ConditionChecker, { ConditionStore } from "./condition-checker";
import InstructionExecutor, { InstructionStore } from "./instruction-executor";
import Conditions from "./conditions";
import Instructions from "./instructions";

class ScriptExecutor {
	private _engine: Engine = null;
	private _checker: ConditionChecker = new ConditionChecker(<ConditionStore>Conditions);
	private _executor: InstructionExecutor = new InstructionExecutor(<InstructionStore>Instructions);

	async continueActions(engine: Engine) {
		this._engine = engine;
		this._checker.engine = engine;
		this._executor.engine = engine;

		const previousActions = engine.currentZone.actions.filter(
			action => action.instructionPointer);
		return await this._evaluateActions(previousActions, false);
	}

	async runActions(engine: Engine) {
		this._engine = engine;
		this._checker.engine = engine;
		this._executor.engine = engine;

		return await this._evaluateActions(engine.currentZone.actions, false);
	}

	private async _evaluateActions(actions: Action[], check = true) {
		const hasActions = actions.length;
		actions = actions.slice();
		while (actions.length) {
			let action = actions.shift();
			if ((!check || await this.actionDoesApply(action)) && await this.executeInstructions(action))
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

	private async actionDoesApply(action: Action): Promise<boolean> {
		if (!action.enabled && action.instructionPointer === 0) return false;
		if (action.instructionPointer !== 0) return true;

		for (const condition of action.conditions) {
			if (!await this._checker.check(condition)) {
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

	public set checker(c: ConditionChecker) {
		this._checker = c;
	}

	public set executor(e: InstructionExecutor) {
		this._executor = e;
	}
}

export default ScriptExecutor;
