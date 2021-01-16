import { Action, Condition, Instruction, Zone } from "src/engine/objects";

class MutableAction extends Action {
	constructor(action?: Action) {
		super();

		if (!action) return;

		this._id = action.id;
		this._zone = action.zone;
		this._conditions = action.conditions;
		this._instructions = action.instructions;
		this._name = action.name;
	}

	get id(): number {
		return this._id;
	}

	set id(value: number) {
		this._id = value;
	}

	set name(value: string) {
		this._name = value;
	}

	get name(): string {
		return this._name;
	}

	set conditions(value: Condition[]) {
		this._conditions = value;
	}

	get conditions(): Condition[] {
		return this._conditions;
	}

	set instructions(value: Instruction[]) {
		this._instructions = value;
	}

	get instructions(): Instruction[] {
		return this._instructions;
	}

	get zone(): Zone {
		return this._zone;
	}

	set zone(value: Zone) {
		this._zone = value;
	}
}

export default MutableAction;
