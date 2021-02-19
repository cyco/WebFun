import { Result, Type } from "../types";

import { Action, Zone } from "../../objects";
import Engine from "../../engine";
import { Instruction } from "src/engine/objects";

import { Point } from "src/util";
import { RoomTransitionScene } from "src/engine/scenes";
import ZoneScene from "src/engine/scenes/zone-scene";

export default {
	Opcode: 0x21,
	Arguments: [Type.ZoneID, Type.ZoneX, Type.ZoneY],
	Description:
		"Change current zone to `arg_0`. Hero will be placed at `arg_1`x`arg_2` in the new zone.",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		const [zoneID, x, y] = instruction.arguments;

		const destinationZone = engine.assets.get(Zone, zoneID);
		const destinationLocation = new Point(x, y);
		const { world, location } = engine.findLocationOfZone(destinationZone);

		if (engine.sceneManager.currentScene instanceof RoomTransitionScene) {
			engine.sceneManager.popScene();
		}

		const transitionScene = new RoomTransitionScene();
		transitionScene.destinationHeroLocation = destinationLocation;
		transitionScene.destinationZone = destinationZone;
		transitionScene.destinationWorld = world ?? engine.currentWorld;
		transitionScene.destinationSector = location;
		transitionScene.scene = engine.sceneManager.currentScene as ZoneScene;
		engine.sceneManager.pushScene(transitionScene);

		return Result.UpdateZone;
	}
};
