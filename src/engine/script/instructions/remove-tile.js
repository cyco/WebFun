import * as Result from "../result";

export const Opcode = 0x01;
export const Arguments = 3;
export default (instruction, engine, action) => {
	const args = instruction.arguments;
	const zone = engine.currentZone;

	zone.removeTile(args[0], args[1], args[2]);

	return Result.UpdateTiles;
};
