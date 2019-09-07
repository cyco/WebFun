import { Result, Type } from "../types";

import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

export default {
	Opcode: 0x24,
	Arguments: [Type.Number],
	Description: "Set current zone's `random` value to a `arg_0`",
	Implementation: async (instruction: Instruction, _: Engine, action: Action): Promise<Result> => {
		action.zone.random = instruction.arguments[0];
		return Result.Void;
	}
};
