import { Result, Type } from "../types";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";

export default {
	Opcode: 0x0a,
	Arguments: [Type.SoundID],
	Description: "Play sound specified by `arg_0`",
	Implementation: async (instruction: Instruction, engine: Engine, _action: Action): Promise<Result> => {
		engine.mixer.effectChannel.playSound(instruction.arguments[0]);
		return Result.Void;
	}
};
