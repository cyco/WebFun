import * as Result from "../result";

export const Opcode = 0x25;
export const Arguments = 1;

export default (instruction, engine, action) => {
	engine.hero.health += instruction.arguments[0];
	return Result.OK;
};
