import { Result, Type } from "../types";
import { randmod } from "src/util";

import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

export default {
	Opcode: 0x0c,
	Arguments: [Type.Number],
	Description: "Set current zone's `random` to a random value between 1 and `arg_0`.",
	Implementation: async (instruction: Instruction, _: Engine, action: Action): Promise<Result> => {
		const args = instruction.arguments;
		const zone = action.zone;
		zone.random = 1 + randmod(args[0]);

		return Result.Void;
	}
};
