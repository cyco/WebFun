import { Condition } from "src/engine/objects";
import { ConditionImplementation } from "./types";
import Engine from "../engine";
import EvaluationMode from "./evaluation-mode";
import { Zone } from "../objects";

export type ConditionStore = ConditionImplementation[];

class ConditionChecker {
	public engine: Engine;
	private readonly _conditions: ConditionStore;

	constructor(conditions: ConditionStore, engine: Engine = null) {
		this.engine = engine;
		this._conditions = conditions;
	}

	public async check(condition: Condition, mode: EvaluationMode, zone: Zone): Promise<boolean> {
		const handler = this._conditions[condition.opcode];
		console.assert(!!handler, `Unknown condition opcode 0x${condition.opcode.toString(0x10)}!`);

		return await handler(condition.arguments, zone, this.engine, mode);
	}
}

export default ConditionChecker;
