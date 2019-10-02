import { Result, Type } from "../types";

import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

export default {
	Opcode: 0x01,
	Arguments: [Type.ZoneX, Type.ZoneY, Type.ZoneZ],
	Description: "Remove tile at `arg_0`x`arg_1`x`arg_2`",
	Implementation: async (instruction: Instruction, _: Engine, action: Action): Promise<Result> => {
		const [x, y, z] = instruction.arguments;
		const zone = action.zone;

		zone.setTile(null, x, y, z);

		return Result.Void;
	}
};
