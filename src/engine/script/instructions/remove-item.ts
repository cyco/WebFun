import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x1d,
	Arguments: [Type.TileID],
	Description: "Remove one instance of item `arg_0` from the inventory",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		const args = instruction.arguments;
		const item = engine.data.tiles[args[0]];
		engine.inventory.removeItem(item);

		return ResultFlags.UpdateInventory;
	}
};
