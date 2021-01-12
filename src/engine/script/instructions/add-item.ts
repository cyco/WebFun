import { Result, Type } from "../types";

import { Tile, Action } from "../../objects";
import Engine from "../../engine";
import { Instruction } from "src/engine/objects";

export default {
	Opcode: 0x1c,
	Arguments: [Type.TileID],
	Description: "Add item with id `arg_0` to inventory",
	Implementation: async (
		instruction: Instruction,
		engine: Engine,
		action: Action
	): Promise<Result> => {
		const args = instruction.arguments;
		const sector = engine.currentWorld.findSectorContainingZone(action.zone);

		const item = args[0] !== -1 ? engine.assets.get(Tile, args[0]) : sector.findItem;
		engine.inventory.addItem(item);

		return Result.Void;
	}
};
