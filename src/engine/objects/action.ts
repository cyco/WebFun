import Condition from "./condition";
import Instruction from "./instruction";
import Zone from "./zone";

class Action {
	public instructionPointer: number = 0;
	public enabled: boolean = true;
	protected _zone: Zone;
	protected _name: string = "";
	protected _id: number = -1;
	protected _conditions: Condition[] = [];
	protected _instructions: Instruction[] = [];

	get zone() {
		return this._zone;
	}

	get name() {
		return this._name;
	}

	get id() {
		return this._id;
	}

	get conditions() {
		return this._conditions;
	}

	get instructions() {
		return this._instructions;
	}
}

export default Action;
