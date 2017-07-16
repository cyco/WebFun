import * as Result from "../result";

export const Opcode = 0x1d;
export const Arguments = 1;
export const Description = "Remove one instance of item `arg_0` from the inventory";
export default (instruction, engine, action) => {
	const args = instruction.arguments;
	const item = engine.data.tiles[args[0]];
	engine.inventory.removeItem(item);

	return Result.UpdateInventory;
};
