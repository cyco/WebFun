import { Result, Type } from "../types";

import { Action, Tile } from "../../objects";
import Engine from "../../engine";
import { Instruction } from "src/engine/objects";

export default {
	Opcode: 0x1d,
	Arguments: [Type.TileID],
	Description: "Remove one instance of item `arg_0` from the inventory",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		const args = instruction.arguments;
		const zone = action.zone;
		const sector = engine.currentWorld.findSectorContainingZone(zone);

		const itemID = args[0] < 0 ? sector.requiredItem.id : args[0];
		const item = engine.assets.get(Tile, itemID);
		engine.inventory.removeItem(item);

		return Result.Void;
	}
};
