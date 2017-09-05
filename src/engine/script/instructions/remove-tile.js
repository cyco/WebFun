import * as Result from "../result";

export const Opcode = 0x01;
export const Arguments = 3;
export const Description = "Remove tile at `arg_0`x`arg_1`x`arg_2`";
export default (instruction, engine, action) => {
	const args = instruction.arguments;
	const zone = engine.currentZone;

	zone.removeTile(args[ 0 ], args[ 1 ], args[ 2 ]);

	return Result.UpdateTiles;
};
