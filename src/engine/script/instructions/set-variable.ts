import { Result, Type } from "../types";

import Engine from "../../engine";
import { Action, Tile, Instruction } from "src/engine/objects";

export default {
	Opcode: 0x0f,
	Arguments: [Type.ZoneX, Type.ZoneY, Type.ZoneZ, Type.TileID],
	Description:
		"Set variable identified by `arg_0`⊕`arg_1`⊕`arg_2` to `arg_3`. Internally this is implemented as opcode 0x00, setting tile at `arg_0`x`arg_1`x`arg_2` to `arg_3`.",
	Implementation: async (
		instruction: Instruction,
		engine: Engine,
		action: Action
	): Promise<Result> => {
		const args = instruction.arguments;
		const zone = action.zone;

		const tile = engine.assets.get(Tile, args[3]);
		zone.setTile(tile, args[0], args[1], args[2]);

		return Result.Void;
	}
};
