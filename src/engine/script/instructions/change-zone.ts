import { TransitionScene } from "src/engine/scenes";
import { Point } from "src/util";
import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../arguments";

export const Opcode = 0x21;
export const Arguments = 3;
export const Description = "Change current zone to `arg_0`. Hero will be placed at `arg_1`x`arg_2` in the new zone.";
export default (instruction: Instruction, engine: Engine, action: Action): Result => {
	const args = instruction.arguments;

	const transitionScene = new TransitionScene();
	transitionScene.type = TransitionScene.TRANSITION_TYPE.ROOM;
	transitionScene.targetHeroLocation = new Point(args[1], args[2]);
	transitionScene.targetZone = engine.data.zones[args[0]];
	transitionScene.scene = engine.sceneManager.currentScene;

	let world = engine.dagobah;
	let location = world.locationOfZone(transitionScene.targetZone);
	if (!location) {
		world = engine.world;
		location = world.locationOfZone(transitionScene.targetZone);
	}
	transitionScene.targetWorld = world;

	if (!location) {
		world = null;
		location = null;
	}
	transitionScene.targetZoneLocation = location;
	engine.sceneManager.pushScene(transitionScene);
	return ResultFlags.OK;
};
