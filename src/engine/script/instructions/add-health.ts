import { Result, Type } from "../types";

import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

export default {
	Opcode: 0x25,
	Arguments: [Type.Number],
	Description:
		"Increase hero's health by `arg_0`. New health is capped at hero's max health (0x300).",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		engine.hero.health += instruction.arguments[0];

		return Result.Void;
	}
};
