import { Result, Type } from "../types";
import { randmod } from "src/util";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";

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
