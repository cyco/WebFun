import * as Result from "../result";

export const Opcode = 0x1c;
export const Arguments = 1;
export const Description = "Add item with id `arg_0` to inventory";
export default (instruction, engine, action) => {
	const args = instruction.arguments;
	const item = engine.data.tiles[args[0]];
	engine.inventory.addItem(item);

	return Result.UpdateInventory;
};
