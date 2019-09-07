import { Result, Type } from "../types";

import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

export default {
	Opcode: 0x02,
	Arguments: [Type.ZoneX, Type.ZoneY, Type.ZoneZ, Type.ZoneX, Type.ZoneY],
	Description:
		"Move Tile at `arg_0`x`arg_0`x`arg_2` to `arg_3`x`arg_4`x`arg_2`. *Note that this can not be used to move tiles between layers!*",
	Implementation: async (instruction: Instruction, _: Engine, action: Action): Promise<Result> => {
		const args = instruction.arguments;
		const zone = action.zone;

		zone.moveTile(args[0], args[1], args[2], args[3], args[4]);

		return Result.Void;
	}
};
