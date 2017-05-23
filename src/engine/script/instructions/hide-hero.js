import * as Result from "../result";

export const Opcode = 0x10;
export const Arguments = 0;
export default (instruction, engine, action) => {
	engine.hero.visible = false;
	return Result.UpdateHero;
};
