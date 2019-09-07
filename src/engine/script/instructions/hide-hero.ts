import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

import { Result } from "../types";

export default {
	Opcode: 0x10,
	Arguments: [],
	Description: "Hide hero",
	Implementation: async (_: Instruction, engine: Engine, _action: Action): Promise<Result> => {
		engine.hero.visible = false;
		return Result.Void;
	}
};
