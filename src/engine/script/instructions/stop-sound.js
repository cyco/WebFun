import * as Result from "../result";

export const Opcode = 0x0b;
export const Arguments = -1;
export default (instruction, engine, action) => {
	return Result.UpdateSound;
};
