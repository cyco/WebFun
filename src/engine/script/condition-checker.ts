import PersistentState from "src/engine/persistent-state";
import Engine from "../engine";
import Condition from "../objects/condition";
import Conditions from "./conditions";

export default class ConditionChecker {
	public engine: Engine;
	private persistentState = new PersistentState();

	constructor(engine: Engine = null) {
		this.engine = engine;
	}

	check(condition: Condition) {
		const handler = Conditions[condition.opcode];
		console.assert(!!handler, `Unknown condition opcode 0x${condition.opcode.toString(0x10)}!`);

		return handler(condition.arguments, this.engine.currentZone, this.engine);
	}
}
