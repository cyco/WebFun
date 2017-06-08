import PersistentState from "/engine/persistent-state";
import Conditions from "./conditions";

export default class ConditionChecker {
	constructor(engine = null) {
		this.engine = engine;
		this.persistentState = new PersistentState();

		Object.seal(this);
	}

	check(condition) {
		const handler = Conditions[condition.opcode];
		console.assert(handler, `Unknown condition opcode 0x${condition.opcode.toString(0x10)}!`);

		return handler(condition.arguments, this.engine.currentZone, this.engine);
	}
}
