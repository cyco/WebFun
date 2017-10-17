import * as Result from "../result";
import { InstructionResult } from "../arguments";
import Instruction from "../../objects/instruction";
import Engine from "../../engine";
import Action from "../../objects/action";

export const Opcode = 0x1f;
export const Arguments = -1;
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	throw "Game Won!";
};
