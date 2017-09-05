import * as Result from "../result";

export const Opcode = 0x0e;
export const Arguments = 1;
export const Description = "Add `arg_0` to current zone's `counter` value";
export default (instruction, engine, action) => {
	engine.currentZone.counter += instruction.arguments[ 0 ];

	return Result.OK;
};
