import { TransitionScene } from "src/engine/scenes";
import ZoneScene from "src/engine/scenes/zone-scene";
import { Point } from "src/util";
import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x21,
	Arguments: [Type.ZoneID, Type.ZoneX, Type.ZoneY],
	Description: "Change current zone to `arg_0`. Hero will be placed at `arg_1`x`arg_2` in the new zone.",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		const args = instruction.arguments;

		const transitionScene = new TransitionScene();
		transitionScene.type = TransitionScene.TRANSITION_TYPE.ROOM;
		transitionScene.targetHeroLocation = new Point(args[1], args[2]);
		transitionScene.targetZone = engine.data.zones[args[0]];
		transitionScene.scene = <ZoneScene>engine.sceneManager.currentScene;

		let world = engine.dagobah;
		let location = world.locationOfZone(transitionScene.targetZone);
		if (!location) {
			world = engine.world;
			location = world.locationOfZone(transitionScene.targetZone);
		}
		transitionScene.targetWorld = world;

		if (!location) {
			location = null;
		}
		transitionScene.targetZoneLocation = location;
		engine.sceneManager.pushScene(transitionScene);
		return Result.OK;
	}
};
