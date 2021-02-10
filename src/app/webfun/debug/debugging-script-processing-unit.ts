import { Action, Condition, Instruction, Zone } from "src/engine/objects";
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

type ConditionStore = ConditionImplementation[];
type InstructionStore = InstructionImplementation[];

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
	executorDidDrain(executor: DebuggingScriptProcessingUnit): void;
}

class DebuggingScriptProcessingUnit extends ScriptProcessingUnit {
	protected _inUse: boolean = false;
	protected _instructionExecutor: InstructionExecutor;
	protected _conditionChecker: ConditionChecker;
	protected _executor: AsyncIterator<ScriptResult> = null;
	public stopped: boolean = false;
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

	prepareExecution(mode: Mode, zone: Zone): void {
		console.assert(!this._inUse, "Executor is already prepared!");
		this.willExecute(zone);
		this._executor = this._buildExecutor(mode, zone);
	}

	protected async *_buildExecutor(mode: Mode, zone: Zone): AsyncIterator<ScriptResult> {
		console.assert(!this._inUse, "Executor is already in use!");
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

	public drain(): void {
		super.drain();

		if (!this.delegate) return;
		this.delegate.executorDidDrain(this);
	}
}

export default DebuggingScriptProcessingUnit;
