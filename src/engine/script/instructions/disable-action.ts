import * as Result from "../result";
import { InstructionResult } from "../arguments";
import Instruction from "../../objects/instruction";
import Engine from "../../engine";
import Action from "../../objects/action";

export const Opcode = 0x14;
export const Arguments = 0;
export const Description = "Disable current action";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	// original implementation disables action only if no redraw occurs
	action.enabled = false;
	return Result.OK;
};
