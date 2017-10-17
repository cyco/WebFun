import { InstructionResult } from "../arguments";
import Instruction from "../../objects/instruction";
import Engine from "../../engine";
import Action from "../../objects/action";

export const Opcode = 0x1e;
export const Arguments = 0;
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	engine.currentZone.solved = true;
	return true;
};
