import { Result, Type } from "../types";

import { Action, Tile } from "../../objects";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";

export default {
	Opcode: 0x1d,
	Arguments: [Type.TileID],
	Description: "Remove one instance of item `arg_0` from the inventory",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		const args = instruction.arguments;
		const item = engine.assetManager.get(Tile, args[0]);
		engine.inventory.removeItem(item);

		return Result.Void;
	}
};
