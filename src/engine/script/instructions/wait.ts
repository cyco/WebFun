import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

import { Result } from "../types";

export default {
	Opcode: 0x08,
	Arguments: [],
	Description: "Pause script execution for one tick.",
	Implementation: async (_1: Instruction, _2: Engine, _3: Action): Promise<Result> => {
		return Result.Wait;
	}
};
