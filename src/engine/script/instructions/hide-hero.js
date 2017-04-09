import * as Result from "../result";

export default (instruction, engine, action) => {
	engine.hero.visible = false;
	return Result.UpdateHero;
};
