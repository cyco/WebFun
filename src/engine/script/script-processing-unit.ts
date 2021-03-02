import { ConditionImplementation, InstructionImplementation, Result, ScriptResult } from "./types";

import ConditionChecker from "./condition-checker";
import Engine from "src/engine/engine";
import InstructionExecutor from "./instruction-executor";
import Mode from "./evaluation-mode";
import { Zone } from "src/engine/objects";

type ConditionStore = ConditionImplementation[];
type InstructionStore = InstructionImplementation[];

class ScriptProcessingUnit {
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

	prepareExecution(mode: Mode, zone: Zone): void {
		console.assert(!this._inUse, "Executor is already prepared!");
		this._executor = this._buildExecutor(mode, zone);
	}

	protected async *_buildExecutor(mode: Mode, zone: Zone): AsyncIterator<ScriptResult> {
		console.assert(!this._inUse, "Executor is already in use!");
		this._inUse = true;

		actions: for (const action of zone.actions) {
			if (!action.enabled) continue;

			this._instructionExecutor.action = action;

			for (const condition of action.conditions) {
				if (!(await this._conditionChecker.check(condition, mode, zone))) {
					continue actions;
				}
			}

			for (const instruction of action.instructions) {
				const result = (await this._instructionExecutor.execute(instruction)) || Result.Void;

				if (result !== Result.Void) {
					yield (result as any) as ScriptResult;
				}
			}
		}

		zone.actionsInitialized = true;

		if (mode === Mode.PlaceItem) {
			this._engine.inputManager.placedTile = null;
			this._engine.inputManager.placedTileLocation = null;
		}

		this._inUse = false;
		return ScriptResult.Done;
	}

	public async run(): Promise<ScriptResult> {
		if (!this._executor) return ScriptResult.Done;

		const result = await this._executor.next();
		const normalizedResult = result.value || ScriptResult.Done;
		if (normalizedResult & ScriptResult.Done) {
			this._executor = null;
		} else {
			this._engine.camera.update(Infinity);
		}

		if (!this._executor) return normalizedResult;

		if ((normalizedResult as any) === Result.UpdateZone) {
			do {
				const result = await this._executor.next();
				if (!result) break;
				if (!result.value) break;
				if (result.value & ScriptResult.Done) break;
			} while (this._executor);

			this._executor = null;
		}
		return normalizedResult;
	}

	public drain(): void {
		this._executor = null;
		this._inUse = false;
	}
}

export default ScriptProcessingUnit;
