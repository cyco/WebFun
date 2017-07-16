import * as Result from "../result";

export const Opcode = 0x0a;
export const Arguments = -1;
export const Description = "Play sound specified by `arg_0`";
export default (instruction, engine, action) => {
	const args = instruction.arguments;
	// engine.mixer.playEffect(engine.data.sounds[args[0]]);
	return Result.UpdateSound;
};
