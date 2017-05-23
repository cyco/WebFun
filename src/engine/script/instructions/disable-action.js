import * as Result from "../result";

export const Opcode = 0x14;
export const Arguments = 0;
export default (instruction, engine, action) => {
	// original implementation disables action only if no redraw occurs
	action.enabled = false;
	return Result.OK;
};
