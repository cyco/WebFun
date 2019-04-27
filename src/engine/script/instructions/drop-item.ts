import { Result, Type } from "../types";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";
import { Point } from "src/util";

export default {
	Opcode: 0x1b,
	Arguments: [Type.TileID, Type.ZoneX, Type.ZoneY],
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		let [itemId, x, y] = instruction.arguments;

		if (itemId === -1) {
			const worldLocation = engine.currentWorld.locationOfZone(action.zone);
			if (!worldLocation) console.warn("can't find location of zone", action.zone, "on current world");
			const worldItem = engine.currentWorld.at(worldLocation);
			itemId = worldItem.findItem.id;
			action.zone.solved = true;
			worldItem.zone.solved = true;
		}

		engine.dropItem(engine.data.tiles[itemId], new Point(x, y));

		return Result.UpdateScene;
	}
};
