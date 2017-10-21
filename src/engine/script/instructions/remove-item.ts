import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../arguments";

export const Opcode = 0x1d;
export const Arguments = 1;
export const Description = "Remove one instance of item `arg_0` from the inventory";
export default (instruction: Instruction, engine: Engine, action: Action): Result => {
	const args = instruction.arguments;
	const item = engine.data.tiles[args[0]];
	engine.inventory.removeItem(item);

	return ResultFlags.UpdateInventory;
};
