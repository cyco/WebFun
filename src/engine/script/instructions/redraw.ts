import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

import { Result } from "../types";

export default {
	Opcode: 0x09,
	Arguments: [],
	Description: "Redraw the whole scene immediately",
	Implementation: async (_: Instruction, _engine: Engine, _action: Action): Promise<Result> => {
		return Result.Void;
	}
};
