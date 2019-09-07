import { Result, Type } from "../types";

import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

export default {
	Opcode: 0x0d,
	Arguments: [Type.Number],
	Description: "Set current zone's `counter` value to a `arg_0`",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		action.zone.counter = instruction.arguments[0];

		return Result.Void;
	}
};
