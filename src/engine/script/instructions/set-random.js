import * as Result from "../result";

export default (instruction, engine, action) => {
	engine.currentZone.random = instruction.arguments[0];
	return Result.OK;
};
