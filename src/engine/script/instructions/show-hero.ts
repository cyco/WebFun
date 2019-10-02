import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

import { Result } from "../types";

export default {
	Opcode: 0x11,
	Arguments: [],
	Description: "Show hero",
	Implementation: async (_instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		engine.hero.visible = true;

		return Result.Void;
	}
};
