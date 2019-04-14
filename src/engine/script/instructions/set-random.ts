import { Result, Type } from "../types";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";

export default {
	Opcode: 0x24,
	Arguments: [Type.Number],
	Description: "Set current zone's `random` value to a `arg_0`",
	Implementation: async (instruction: Instruction, _: Engine, action: Action): Promise<Result> => {
		action.zone.random = instruction.arguments[0];
		return Result.Void;
	}
};
