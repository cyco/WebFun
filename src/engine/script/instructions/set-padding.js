import * as Result from "../result";

export default (instruction, engine, action) => {
	engine.currentZone.padding = instruction.arguments[0];
	return Result.OK;
};
