import * as Result from "../result";

export const Opcode = 0x00;
export const Arguments = 4;
export default (instruction, engine, action) => {
	const args = instruction.arguments;
	const zone = engine.currentZone;

	const tile = engine.data.tiles[args[3]];
	zone.setTile(tile, args[0], args[1], args[2]);

	return Result.UpdateTiles;
};
