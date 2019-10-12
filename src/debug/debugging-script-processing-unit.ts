import { Action, Condition, Instruction } from "src/engine/objects";
import {
	ConditionImplementation,
	InstructionImplementation,
	Result,
	ScriptResult
} from "src/engine/script/types";

import ConditionChecker from "src/engine/script/condition-checker";
import Engine from "src/engine/engine";
import InstructionExecutor from "src/engine/script/instruction-executor";
import Mode from "src/engine/script/evaluation-mode";
import ScriptProcessingUnit from "src/engine/script/script-processing-unit";
import { Zone } from "src/engine/objects";

type ConditionStore = ConditionImplementation[];
type InstructionStore = InstructionImplementation[];

class ScriptExecutionError extends Error {}

export interface DebuggingScriptProcessingUnitDelegate {
	executorWillExecute(
		executor: DebuggingScriptProcessingUnit,
		thing: Zone | Action | Condition | Instruction
	): void;
	executorDidExecute(
		executor: DebuggingScriptProcessingUnit,
		thing: Zone | Action | Condition | Instruction,
		result: ScriptResult | Result | boolean
	): void;
}

class DebuggingScriptProcessingUnit extends ScriptProcessingUnit {
	protected _inUse: boolean = false;
	protected _instructionExecutor: InstructionExecutor;
	protected _conditionChecker: ConditionChecker;
	protected _executor: AsyncIterator<ScriptResult> = null;
	public stopped: boolean = true;
	public delegate: DebuggingScriptProcessingUnitDelegate;
	protected _engine: Engine;

	constructor(
		engine: Engine,
		instructions: InstructionStore,
		conditions: ConditionStore,
		delegate: DebuggingScriptProcessingUnitDelegate = null
	) {
		super(engine, instructions, conditions);
		this._instructionExecutor = new InstructionExecutor(instructions, engine);
		this._conditionChecker = new ConditionChecker(conditions, engine);
		this.delegate = delegate;
		this._engine = engine;
	}

	prepeareExecution(mode: Mode, zone: Zone) {
		if (this._inUse) {
			console.warn("Executor is already prepeared!");
			this._inUse = false;
		}

		this.willExecute(zone);
		this._executor = this._buildExecutor(mode, zone);
	}

	protected async *_buildExecutor(mode: Mode, zone: Zone): AsyncIterator<ScriptResult> {
		if (this._inUse) {
			throw new ScriptExecutionError("Executor is already in use!");
		}

		this._inUse = true;

		actions: for (const action of zone.actions) {
			if (!action.enabled) continue;

			this.willExecute(action);
			this._instructionExecutor.action = action;
			while (this.stopped) yield ScriptResult.Wait;

			for (const condition of action.conditions) {
				this.willExecute(condition);
				while (this.stopped) yield ScriptResult.Wait;
				const result = await this._conditionChecker.check(condition, mode, zone);
				this.didExecute(condition, result);
				while (this.stopped) yield ScriptResult.Wait;
				if (!result) {
					continue actions;
				}
			}
			for (const instruction of action.instructions) {
				this.willExecute(instruction);
				while (this.stopped) yield ScriptResult.Wait;
				const result = (await this._instructionExecutor.execute(instruction)) || Result.Void;
				this.didExecute(instruction, result);
				while (this.stopped) yield ScriptResult.Wait;
				if (result !== Result.Void) {
					yield (result as any) as ScriptResult;
				}
			}

			this.didExecute(action, null);
			while (this.stopped) yield ScriptResult.Wait;
		}

		zone.actionsInitialized = true;
		// TODO: get rid of temporaryState
		this._engine.temporaryState.justEntered = false;
		this._engine.temporaryState.enteredByPlane = false;
		this._engine.temporaryState.bump = null;

		if (mode === Mode.PlaceItem) {
			console.log("clear placed item");
			this._engine.inputManager.placedTile = null;
			this._engine.inputManager.placedTileLocation = null;
		}

		this._inUse = false;
		this.didExecute(zone, ScriptResult.Done);

		return ScriptResult.Done;
	}

	private willExecute(thing: Zone | Action | Condition | Instruction) {
		if (!this.delegate) return;
		this.delegate.executorWillExecute(this, thing);
	}

	private didExecute(
		thing: Zone | Action | Condition | Instruction,
		result: ScriptResult | Result | boolean
	) {
		if (!this.delegate) return;
		this.delegate.executorDidExecute(this, thing, result);
	}

	public async run(): Promise<ScriptResult> {
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

export default DebuggingScriptProcessingUnit;
