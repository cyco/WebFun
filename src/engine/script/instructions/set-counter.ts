import { Result, Type } from "../types";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";
import InstructionType from "../instruction";

export default {
	Opcode: 0x0d,
	Arguments: [Type.Number],
	Description: "Set current zone's `counter` value to a `arg_0`",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		action.zone.counter = instruction.arguments[0];

		return Result.Void;
	}
} as InstructionType;
