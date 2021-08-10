import Condition from "./condition";
import Instruction from "./instruction";
import Zone from "./zone";
import { Action as RawAction } from "src/engine/file-format/types";

class Action {
	public id: number;
	public name: string;
	public conditions: Condition[];
	public instructions: Instruction[];
	public zone: Zone; // TODO: Check if property is actually required

	// Runtime attributes
	public enabled: boolean = true;
	public instructionPointer: number = 0;

	public constructor(id: number, zone: Zone, data: Action | RawAction) {
		this.id = id;
		this.zone = zone;
		this.name = data.name ?? "";

		if (data instanceof Zone) {
			this.conditions = data.conditions.slice();
			this.instructions = data.instructions.slice();
		} else {
			this.conditions = data.conditions;
			this.instructions = data.instructions;
		}
	}
}

export default Action;
