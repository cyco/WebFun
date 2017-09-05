import * as Result from "../result";

export const Opcode = 0x23;
export const Arguments = 1;
export const Description = "Add `arg_0` to current zone's `padding` value";
export default (instruction, engine, action) => {
	engine.currentZone.padding += instruction.arguments[ 0 ];

	return Result.OK;
};
