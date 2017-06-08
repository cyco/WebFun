import { PickupScene } from "/engine/scenes";
import { Point } from "/util";
import * as Result from "../result";

export const Opcode = 0x1b;
export const Arguments = 3;
export default (instruction, engine, action) => {
	// TODO: validate against original implementation
	const args = instruction.arguments;
	const zone = engine.currentZone;

	const pickupScene = new PickupScene(engine);
	pickupScene.location = new Point(args[1], args[2]);
	pickupScene.tile = engine.data.tiles[args[0]];
	if (pickupScene.tile === null) {
		pickupScene.tile = zone.puzzleGain;
		zone.solved = true;
	}
	engine.sceneManager.pushScene(pickupScene);

	return true;
};
