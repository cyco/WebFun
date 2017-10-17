import * as Result from "../result";
import { InstructionResult } from "../arguments";
import Instruction from "../../objects/instruction";
import Engine from "../../engine";
import Action from "../../objects/action";

export const Opcode = 0x0b;
export const Arguments = -1;
export const Description = "Stop playing sounds. _TODO: check if only music need to be stopped`";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	return Result.UpdateSound;
};
