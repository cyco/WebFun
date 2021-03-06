import { Result, Type } from "../types";

import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

export default {
	Opcode: 0x0e,
	Arguments: [Type.Number],
	Description: "Add `arg_0` to current zone's `counter` value",
	Implementation: async (instruction: Instruction, _: Engine, action: Action): Promise<Result> => {
		action.zone.counter += instruction.arguments[0];

		return Result.Void;
	}
};
