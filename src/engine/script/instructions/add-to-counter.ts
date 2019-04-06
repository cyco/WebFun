import { Result, Type } from "../types";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";
import InstructionType from "../instruction";

export default {
	Opcode: 0x0e,
	Arguments: [Type.Number],
	Description: "Add `arg_0` to current zone's `counter` value",
	Implementation: async (instruction: Instruction, _: Engine, action: Action): Promise<Result> => {
		action.zone.counter += instruction.arguments[0];

		return Result.Void;
	}
} as InstructionType;
