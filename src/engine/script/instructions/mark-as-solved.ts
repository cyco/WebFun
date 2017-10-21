import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Flags, InstructionResult } from "../arguments";

export const Opcode = 0x1e;
export const Arguments = 0;
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	engine.currentZone.solved = true;
	return Flags.OK;
};
