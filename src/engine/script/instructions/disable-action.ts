import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../arguments";

export const Opcode = 0x14;
export const Arguments = 0;
export const Description = "Disable current action";
export default (instruction: Instruction, engine: Engine, action: Action): Result => {
	// original implementation disables action only if no redraw occurs
	action.enabled = false;
	return ResultFlags.OK;
};
