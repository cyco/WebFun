import * as Result from "../result";

export default (instruction, engine, action) => {
	engine.hero.health += instruction.arguments[0];
	return Result.OK;
};
