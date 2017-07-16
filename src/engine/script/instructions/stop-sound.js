import * as Result from "../result";

export const Opcode = 0x0b;
export const Arguments = -1;
export const Description = "Stop playing sounds. _TODO: check if only music need to be stopped`";
export default (instruction, engine, action) => {
	return Result.UpdateSound;
};
