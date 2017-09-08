import * as Result from "../result";

export const Opcode = 0x24;
export const Arguments = 1;
export const Description = "Set current zone's `random` value to a `arg_0`";
export default (instruction, engine, action) => {
	engine.currentZone.random = instruction.arguments[0];
	return Result.OK;
};
