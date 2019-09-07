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
		const worldItem = engine.currentWorld.itemForZone(zone);

		const itemID = args[0] < 0 ? worldItem.requiredItem.id : args[0];
		const item = engine.assetManager.get(Tile, itemID);
		engine.inventory.removeItem(item);

		return Result.Void;
	}
};
