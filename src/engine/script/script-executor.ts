import Engine from "src/engine/engine";
import { Zone } from "src/engine/objects";
import Mode from "./evaluation-mode";
import { ConditionImplementation, InstructionImplementation, Result, ScriptResult } from "./types";
import InstructionExecutor from "./instruction-executor";
import ConditionChecker from "./condition-checker";

type ConditionStore = ConditionImplementation[];
type InstructionStore = InstructionImplementation[];

class ScriptExecutionError extends Error {}

class ScriptExecutor {
	protected _inUse: boolean = false;
	protected _instructionExecutor: InstructionExecutor;
	protected _conditionChecker: ConditionChecker;
	protected _executor: AsyncIterator<ScriptResult> = null;
	protected _engine: Engine;

	constructor(engine: Engine, instructions: InstructionStore, conditions: ConditionStore) {
		this._instructionExecutor = new InstructionExecutor(instructions, engine);
		this._conditionChecker = new ConditionChecker(conditions, engine);
		this._engine = engine;
	}

	prepeareExecution(mode: Mode, zone: Zone) {
		if (this._inUse) {
			console.warn("Executor is already prepeared!");
			this._inUse = false;
		}

		this._executor = this._buildExecutor(mode, zone);
	}

	protected async *_buildExecutor(mode: Mode, zone: Zone): AsyncIterator<ScriptResult> {
		console.log("Build Executor", mode, zone.id.toHex(3));
		if (this._inUse) {
			throw new ScriptExecutionError("Executor is already in use!");
		}
		this._inUse = true;

		actions: for (const action of zone.actions) {
			if (!action.enabled) continue;

			this._instructionExecutor.action = action;

			for (const condition of action.conditions) {
				if (!(await this._conditionChecker.check(condition, mode, zone))) {
					continue actions;
				}
			}
			console.log(`Execute Action ${action.id} of Zone ${zone.id.toHex(3)}`);

			for (const instruction of action.instructions) {
				const result = (await this._instructionExecutor.execute(instruction)) || Result.Void;
				if (result !== Result.Void) {
					yield (result as any) as ScriptResult;
				}
			}
		}

		zone.actionsInitialized = true;
		// TODO: get rid of temporaryState
		this._engine.temporaryState.justEntered = false;
		this._engine.temporaryState.enteredByPlane = false;
		this._engine.temporaryState.bump = null;

		this._inUse = false;

		return ScriptResult.Done;
	}

	public async execute(): Promise<ScriptResult> {
		if (!this._executor) return ScriptResult.Done;

		const result = await this._executor.next();
		const normalizedResult = result.value || ScriptResult.Done;
		if (normalizedResult === ScriptResult.Done) {
			this._executor = null;
		}
		return normalizedResult;
	}

	public get inUse() {
		return this._inUse;
	}
}

export default ScriptExecutor;
