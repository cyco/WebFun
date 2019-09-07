import { Result, Type } from "../types";

import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

export default {
	Opcode: 0x13,
	Arguments: [Type.Number, Type.Number, Type.Number, Type.Number, Type.Number],
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		const [relx, rely, absx, absy] = instruction.arguments;

		engine.hero.location.x += relx;
		if (absx !== -1) engine.hero.location.x = absx;

		engine.hero.location.y += rely;
		if (absy !== -1) engine.hero.location.y = absy;

		// original implementation actually has a hard break here
		return Result.Void;
	}
};
