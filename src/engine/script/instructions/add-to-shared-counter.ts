import { Result, Type } from "../types";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";

export default {
	Opcode: 0x23,
	Arguments: [Type.Number],
	Description: "Add `arg_0` to current zone's `shared-counter` value",
	Implementation: async (instruction: Instruction, _: Engine, action: Action): Promise<Result> => {
		action.zone.sharedCounter += instruction.arguments[0];

		return Result.Void;
	}
};
