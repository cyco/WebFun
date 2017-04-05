import PickupScene from "/engine/scenes/pickup-scene";
import Point from "/util/point";
import * as Result from "../result";

export default (instruction, engine, action) => {
	// TODO: validate against original implementation
	const args = instruction.arguments;
	const zone = engine.state.currentZone;

	const pickupScene = new PickupScene(engine);
	pickupScene.location = new Point(args[1], args[2]);
	pickupScene.tile = engine.data.getTile(args[0]);
	if (pickupScene.tile === null) {
		pickupScene.tile = zone.puzzleGain;
		zone.solved = true;
	}
	engine.sceneManager.pushScene(pickupScene);

	return true;
};
