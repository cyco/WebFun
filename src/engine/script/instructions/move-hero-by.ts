import { Result, Type } from "../types";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";
import InstructionType from "../instruction";

export default {
	Opcode: 0x13,
	Arguments: [Type.Number, Type.Number, Type.Number, Type.Number, Type.Number],
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		engine.hero.location.x += instruction.arguments[0];
		engine.hero.location.y += instruction.arguments[1];

		// original implementation actually has a hard break here
		return Result.Void;
	}
} as InstructionType;
