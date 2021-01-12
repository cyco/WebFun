import { Result, Type } from "../types";

import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

export default {
	Opcode: 0x07,
	Arguments: [Type.ZoneX, Type.ZoneY, Type.Number, Type.Number],
	Description:
		"Redraw the part of the current scene, specified by a rectangle positioned at `arg_0`x`arg_1` with width `arg_2` and height `arg_3`.",
	Implementation: async (
		_instruction: Instruction,
		_engine: Engine,
		_action: Action
	): Promise<Result> => {
		return Result.Void;
	}
};
