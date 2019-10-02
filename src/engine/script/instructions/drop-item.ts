import { Result, Type } from "../types";

import { Tile, Action } from "../../objects";
import Engine from "../../engine";
import { Instruction } from "src/engine/objects";
import { Point } from "src/util";

export default {
	Opcode: 0x1b,
	Arguments: [Type.TileID, Type.ZoneX, Type.ZoneY],
	Description:
		"Drops item `arg_0` for pickup at `arg_1`x`arg_2`. If the item is -1, it drops the current sector's find item. instead",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		let [itemID, x, y] = instruction.arguments;

		if (itemID === -1) {
			const sector = engine.currentWorld.findSectorContainingZone(action.zone);
			itemID = sector.findItem.id;
			sector.solved1 = true;
		}

		engine.dropItem(engine.assets.get(Tile, itemID), new Point(x, y));

		return Result.UpdateScene;
	}
};
