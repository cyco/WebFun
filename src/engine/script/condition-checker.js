import PersistentState from "/engine/persistent-state";
import { default as Conditions } from "/engine/script/conditions";

export default class ConditionChecker {
	constructor(engine = null) {
		this.engine = engine;
		this.persistentState = new PersistentState();

		Object.seal(this);
	}

	check(condition) {
		const handler = Conditions[condition.opcode];
		if (!handler)
			throw `Unknown condition opcode 0x${condition.opcode.toString(0x10)}!`;

		return handler(condition.arguments, this.engine.state.currentZone, this.engine);
	}
}
