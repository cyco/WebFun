import Engine from "../engine";
import Condition from "../objects/condition";
import Conditions from "./conditions";

export default class ConditionChecker {
	public engine: Engine;

	constructor(engine: Engine = null) {
		this.engine = engine;
	}

	public async check(condition: Condition) {
		const handler = Conditions[condition.opcode];
		console.assert(!!handler, `Unknown condition opcode 0x${condition.opcode.toString(0x10)}!`);

		return await handler(condition.arguments, this.engine.currentZone, this.engine);
	}
}
