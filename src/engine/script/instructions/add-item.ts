import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../arguments";

export const Opcode = 0x1c;
export const Arguments = 1;
export const Description = "Add item with id `arg_0` to inventory";
export default (instruction: Instruction, engine: Engine, action: Action): Result => {
	const args = instruction.arguments;
	const item = engine.data.tiles[args[0]];
	engine.inventory.addItem(item);

	return ResultFlags.UpdateInventory;
};
