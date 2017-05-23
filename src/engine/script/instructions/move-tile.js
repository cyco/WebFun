import * as Result from "../result";

export const Opcode = 0x02;
export const Arguments = 5;
export default (instruction, engine, action) => {
	const args = instruction.arguments;
	const zone = engine.currentZone;

	zone.moveTile(args[0], args[1], args[2], args[3], args[4]);

	return Result.UpdateTiles;
};
