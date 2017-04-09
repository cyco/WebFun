import * as Result from "../result";

export default (instruction, engine, action) => {
	engine.currentZone.solved = true;
	return true;
};
