import * as Result from "../result";

export const Opcode = 0x0d;
export const Arguments = 1;
export const Description = "Set current zone's `counter` value to a `arg_0`";
export default (instruction, engine, action) => {
	engine.currentZone.counter = instruction.arguments[ 0 ];

	return Result.OK;
};
