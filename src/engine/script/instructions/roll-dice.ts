import { Result, Type } from "../types";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";
import InstructionType from "../instruction";

export default {
	Opcode: 0x0c,
	Arguments: [Type.Number],
	Description: "Set current zone's `random` to a random value between 1 and `arg_0`.",
	Implementation: async (instruction: Instruction, _: Engine, action: Action): Promise<Result> => {
		const args = instruction.arguments;
		const zone = action.zone;
		zone.random = 1 + (Math.round(Math.random() * args[0]) % args[0]);
		return Result.Void;
	}
} as InstructionType;
