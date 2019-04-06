import { Result, Type } from "../types";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";
import InstructionType from "../instruction";

export default {
	Opcode: 0x1d,
	Arguments: [Type.TileID],
	Description: "Remove one instance of item `arg_0` from the inventory",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		const args = instruction.arguments;
		const item = engine.data.tiles[args[0]];
		engine.inventory.removeItem(item);

		return Result.Void;
	}
} as InstructionType;
