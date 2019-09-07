import { Result, Type } from "../types";

import { Tile, Action } from "../../objects";
import Engine from "../../engine";
import { Instruction } from "src/engine/objects";
import { Point } from "src/util";

export default {
	Opcode: 0x1b,
	Arguments: [Type.TileID, Type.ZoneX, Type.ZoneY],
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		let [itemId, x, y] = instruction.arguments;

		if (itemId === -1) {
			const sector = engine.currentWorld.itemForZone(action.zone);
			itemId = sector.findItem.id;
			action.zone.solved = true;
			sector.zone.solved = true;
		}

		engine.dropItem(engine.assetManager.get(Tile, itemId), new Point(x, y));

		return Result.UpdateScene;
	}
};
