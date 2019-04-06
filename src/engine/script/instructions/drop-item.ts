import { Result, Type } from "../types";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";
import InstructionType from "../instruction";
import { PickupScene } from "src/engine/scenes";
import { Point } from "src/util";

export default {
	Opcode: 0x1b,
	Arguments: [Type.TileID, Type.ZoneX, Type.ZoneY],
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		const args = instruction.arguments;
		let itemID = args[0];

		if (itemID === -1) {
			const worldLocation = engine.currentWorld.locationOfZone(action.zone);
			if (!worldLocation) console.warn("can't find location of zone", action.zone, "on current world");
			const worldItem = engine.currentWorld.at(worldLocation);
			itemID = worldItem.findItem.id;
			action.zone.solved = true;
			worldItem.zone.solved = true;
		}

		const pickupScene = new PickupScene(engine);
		pickupScene.location = new Point(args[1], args[2]);
		pickupScene.tile = engine.data.tiles[itemID];

		engine.sceneManager.pushScene(pickupScene);

		return Result.Void;
	}
} as InstructionType;
