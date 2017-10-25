import Engine from "../engine";
import Condition from "../objects/condition";
import { ConditionImplementation } from "./arguments";

export type ConditionStore = {[opcode: number]: ConditionImplementation};

class ConditionChecker {
	public engine: Engine;
	private _conditions: ConditionStore;

	constructor(conditions: ConditionStore, engine: Engine = null) {
		this.engine = engine;
		this._conditions = conditions;
	}

	public async check(condition: Condition) {
		const handler = this._conditions[condition.opcode];
		console.assert(!!handler, `Unknown condition opcode 0x${condition.opcode.toString(0x10)}!`);

		return await handler(condition.arguments, this.engine.currentZone, this.engine);
	}
}
export default ConditionChecker;
