import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";

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
