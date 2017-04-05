import TransitionScene from "/engine/scenes/transition-scene";
import { Point } from "/util";
import * as Result from "../result";

export default (instruction, engine, action) => {
	const args = instruction.arguments;

	const transitionScene = new TransitionScene();
	transitionScene.type = TransitionScene.TRANSITION_TYPE.ROOM;
	transitionScene.targetHeroLocation = new Point(args[1], args[2]);
	transitionScene.targetZone = engine.data.zones[args[0]];
	transitionScene.scene = engine.sceneManager.currentScene;

	const document = engine.document;
	let world = document.dagobah;
	let location = world.locationOfZone(transitionScene.targetZone);
	if (!location) {
		world = document.world;
		location = world.locationOfZone(transitionScene.targetZone);
	}

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
