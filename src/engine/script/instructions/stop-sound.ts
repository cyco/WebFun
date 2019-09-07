import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

import { Result } from "../types";

export default {
	Opcode: 0x0b,
	Arguments: [],
	Description: "Stop playing sounds. _TODO: check if only music need to be stopped`",
	Implementation: async (_: Instruction, _engine: Engine, _action: Action): Promise<Result> => {
		return Result.Void;
	}
};
