import { TransitionScene } from "src/engine/scenes";
import { Point } from "src/util";
import * as Result from "../result";

export const Opcode = 0x21;
export const Arguments = 3;
export const Description = "Change current zone to `arg_0`. Hero will be placed at `arg_1`x`arg_2` in the new zone.";
export default (instruction, engine, action) => {
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
	return true;
	// TODO: fix return value
	return Result.UpdateZone;
};
