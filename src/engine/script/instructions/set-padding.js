import * as Result from "../result";

export const Opcode = 0x22;
export const Arguments = 1;
export const Description = "Set current zone's `padding` value to a `arg_0`";
export default (instruction, engine, action) => {
	engine.currentZone.padding = instruction.arguments[0];
	return Result.OK;
};
