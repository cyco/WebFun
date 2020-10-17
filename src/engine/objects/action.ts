import Condition from "./condition";
import Instruction from "./instruction";
import Zone from "./zone";

class Action {
	public instructionPointer: number = 0;
	public enabled: boolean = true;
	protected _zone: Zone = null;
	protected _name: string = "";
	protected _id: number = -1;
	protected _conditions: Condition[] = [];
	protected _instructions: Instruction[] = [];

	get zone(): Zone {
		return this._zone;
	}

	get name(): string {
		return this._name;
	}

	get id(): number {
		return this._id;
	}

	get conditions(): Condition[] {
		return this._conditions;
	}

	get instructions(): Instruction[] {
		return this._instructions;
	}
}

export default Action;
