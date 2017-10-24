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

	continueActions(engine: Engine): Promise<Boolean> {
		this._engine = engine;
		this._checker.engine = engine;
		this._executor.engine = engine;

		const previousActions = engine.currentZone.actions.filter(
			action => action.instructionPointer);
		if (previousActions.length) {
			console.log("Continue actions: ", previousActions);
		}
		return this._evaluateActions(previousActions, false);
	}

	runActions(engine: Engine): Promise<boolean> {
		this._engine = engine;
		this._checker.engine = engine;
		this._executor.engine = engine;

		console.log(`run ${engine.currentZone.actions.length} actions`);
		return this._evaluateActions(engine.currentZone.actions, true);
	}

	private async _evaluateActions(actions: Action[], check = true): Promise<boolean> {
		if (check) console.log("skip condition checks");

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
		console.log(`actn-${action.id} -doesApply`);

		if (!action.enabled && action.instructionPointer === 0) return false;
		if (action.instructionPointer !== 0) return true;

		for (const condition of action.conditions) {
			if (!(await this._checker.check(condition))) {
				return false;
			}
		}

		return true;
	}

	private async executeInstructions(action: Action): Promise<boolean> {
		console.log(`actn-${action.id} - execute starting at ${action.instructionPointer | 0}`);
		this._executor.action = action;
		for (let i = action.instructionPointer | 0, len = action.instructions.length; i < len; i++) {
			action.instructionPointer = i + 1;
			console.log(`actn-${action.id} - exec instruction ${i}, ${action.instructions.length} total`);
			const result = await this._executor.execute(action.instructions[i]);
			if ((result & ResultFlags.Wait)) {
				console.log("suspending execution", "Wait");
				return true;
			}
			if ((result & ResultFlags.UpdateText)) {
				console.log("suspending execution", "UpdateText");
				return true;
			}
			if ((result & ResultFlags.UpdateZone)) {
				console.log("suspending execution", "UpdateZone");
				return true;
			}
		}
		console.log(`actn-${action.id} - execution finished`);
		action.instructionPointer = 0;
		this._executor.action = null;
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
