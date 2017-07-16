import * as Result from "../result";

export const Opcode = 0x25;
export const Arguments = 1;
export const Description = 'Increase hero\'s health by `arg_0`. New health is capped at hero\'s max health (0x300).';
export default (instruction, engine, action) => {
	engine.hero.health += instruction.arguments[0];
	return Result.OK;
};
