import * as Result from "../result";

export const Opcode = 0x11;
export const Arguments = 0;
export const Description = "Show hero"
export default (instruction, engine, action) => {
	engine.hero.visible = true;
	return Result.UpdateHero;
};
