import { PickupScene } from "src/engine/scenes";
import { Point } from "src/util";
import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x1b,
	Arguments: [Type.TileID, Type.ZoneX, Type.ZoneY],
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		const args = instruction.arguments;

		const pickupScene = new PickupScene(engine);
		pickupScene.location = new Point(args[1], args[2]);
		pickupScene.tile = engine.data.tiles[args[0]];
		engine.sceneManager.pushScene(pickupScene);

		return Result.Void;
	}
};
