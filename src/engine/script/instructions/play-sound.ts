import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Flags as Result, InstructionResult } from "../arguments";

export const Opcode = 0x0a;
export const Arguments = -1;
export const Description = "Play sound specified by `arg_0`";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	const args = instruction.arguments;
	// engine.mixer.playEffect(engine.data.sounds[args[0]]);
	return Result.UpdateSound;
};
