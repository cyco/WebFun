import { Result, Type } from "../types";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";

export default {
	Opcode: 0x22,
	Arguments: [Type.Number],
	Description: "Set current zone's `shared-counter` value to a `arg_0`",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		action.zone.sharedCounter = instruction.arguments[0];
		return Result.Void;
	}
};
