import * as Result from "../result";

export const Opcode = 0x1d;
export const Arguments = 1;
export default (instruction, engine, action) => {
	const args = instruction.arguments;
	const item = engine.data.tiles[args[0]];
	engine.inventory.removeItem(item);

	return Result.UpdateInventory;
};
