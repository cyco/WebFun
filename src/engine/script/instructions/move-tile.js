import * as Result from "../result";

export default (instruction, engine, action) => {
	const args = instruction.arguments;
	const zone = engine.currentZone;

	zone.moveTile(args[0], args[1], args[2], args[3], args[4]);

	return Result.UpdateTiles;
};
