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
	Description: "Change current zone to `arg_0`. Hero will be placed at `arg_1`x`arg_2` in the new zone.",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		const args = instruction.arguments;

		const transitionScene = new RoomTransitionScene();
		transitionScene.destinationHeroLocation = new Point(args[1], args[2]);
		transitionScene.destinationZone = engine.assetManager.get(Zone, args[0]);
		transitionScene.scene = engine.sceneManager.currentScene as ZoneScene;

		let world = engine.dagobah;
		let location = world.findLocationOfZone(transitionScene.destinationZone);
		if (!location) {
			world = engine.world;
			location = world.findLocationOfZone(transitionScene.destinationZone);
		}
		transitionScene.destinationWorld = world;

		if (!location) {
			location = null;
		}
		transitionScene.destinationZoneLocation = location;
		engine.sceneManager.pushScene(transitionScene);
		return Result.Void;
	}
};
