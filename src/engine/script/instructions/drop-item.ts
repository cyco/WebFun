import { PickupScene } from "src/engine/scenes";
import { Point } from "src/util";
import * as Result from "../result";
import { InstructionResult } from "../arguments";
import Instruction from "../../objects/instruction";
import Engine from "../../engine";
import Action from "../../objects/action";

export const Opcode = 0x1b;
export const Arguments = 3;
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
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
