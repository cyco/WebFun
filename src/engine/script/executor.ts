import Point from "../../util/point";
import Engine from "../engine";
import Action from "../objects/action";
import ConditionChecker from "./condition-checker";
import InstructionExecutor from "./instruction-executor";

class Executor {
	private _engine: Engine;
	private _checker = new ConditionChecker();
	private _executor = new InstructionExecutor();

	run(engine: Engine): void {
		this._engine = engine;
		this._checker.engine = engine;
		this._executor.engine = engine;

		const previousActions = engine.currentZone.actions.filter(
			(action) => action.instructionPointer);
		this._evaluateActions(previousActions, false);
	}

	_evaluateActions(actions: Action[], check = true): boolean {
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

	bump(targetPoint: Point) {
		// TODO: implement (see breaking executor)
	}

	executeInstructions(action: Action): boolean {
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

export default Executor;
