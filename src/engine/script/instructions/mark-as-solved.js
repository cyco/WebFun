import * as Result from "../result";

export default (instruction, engine, action) => {
	engine.state.currentZone.solved = true;
	return true;
};
