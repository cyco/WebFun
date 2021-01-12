import { Result, Type } from "../types";

import { Tile, Action } from "../../objects";
import Engine from "../../engine";
import { Instruction } from "src/engine/objects";

export default {
	Opcode: 0x00,
	Arguments: [Type.ZoneX, Type.ZoneY, Type.ZoneZ, Type.TileID],
	Description: "Place tile `arg_3` at `arg_0`x`arg_1`x`arg_2`. To remove a tile the id -1 is used.",
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
