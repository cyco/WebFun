import * as Result from "../result";

export default (instruction, engine, action) => {
	const args = instruction.arguments;
	const item = engine.data.tiles[args[0]];
	engine.inventory.removeItem(item);

	return Result.UpdateInventory;
};
