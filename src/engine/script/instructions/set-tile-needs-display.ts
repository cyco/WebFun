import { Result, Type } from "../types";

import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

export default {
	Opcode: 0x06,
	Arguments: [Type.ZoneX, Type.ZoneY],
	Description: "Redraw tile at `arg_0`x`arg_1`",
	Implementation: async (
		_instruction: Instruction,
		_engine: Engine,
		_action: Action
	): Promise<Result> => {
		return Result.Void;
	}
};
