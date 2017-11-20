import { Action } from "src/engine/objects";

class MutableAction extends Action {
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
