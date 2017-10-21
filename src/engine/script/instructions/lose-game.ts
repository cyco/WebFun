import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { InstructionResult } from "../arguments";

export const Opcode = 0x20;
export const Arguments = -1;
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	throw "Game Lost!";
};
