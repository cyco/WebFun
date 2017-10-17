import Condition from "./condition";
import Instruction from "./instruction";

class Action {
	public instructionPointer: number = 0;
	public enabled: boolean = true;
	public name: string = "";
	public debug: any = {};
	private _id: number = -1;
	private _conditions: Condition[] = [];
	private _instructions: Instruction[] = [];

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
