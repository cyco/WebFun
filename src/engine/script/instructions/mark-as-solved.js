import * as Result from "../result";

export const Opcode = 0x1e;
export const Arguments = 0;
export default (instruction, engine, action) => {
	engine.currentZone.solved = true;
	return true;
};
