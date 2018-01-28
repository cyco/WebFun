import { Action } from "src/engine/objects";

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

	get id() {
		return this._id;
	}

	set id(value) {
		this._id = value;
	}

	set name(value) {
		this._name = value;
	}

	get name() {
		return this._name;
	}

	set conditions(value) {
		this._conditions = value;
	}

	get conditions() {
		return this._conditions;
	}

	set instructions(value) {
		this._instructions = value;
	}

	get instructions() {
		return this._instructions;
	}

	get zone() {
		return this._zone;
	}

	set zone(value) {
		this._zone = value;
	}
}

export default MutableAction;
