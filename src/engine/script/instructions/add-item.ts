import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x1c,
	Arguments: [Type.TileID],
	Description: "Add item with id `arg_0` to inventory",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		const args = instruction.arguments;
		const item = engine.data.tiles[args[0]];
		engine.inventory.addItem(item);

		return Result.Void;
	}
};
