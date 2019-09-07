import { Result, Type } from "../types";

import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

export default {
	Opcode: 0x22,
	Arguments: [Type.Number],
	Description: "Set current zone's `shared-counter` value to a `arg_0`",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		action.zone.sharedCounter = instruction.arguments[0];
		return Result.Void;
	}
};
