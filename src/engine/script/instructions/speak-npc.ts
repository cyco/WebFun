import * as Result from "../result";
import { InstructionResult } from "../arguments";
import Instruction from "../../objects/instruction";
import Engine from "../../engine";
import Action from "../../objects/action";
import { Point } from "src/util";
import SpeakText from "./speak-text";

export const Opcode = 0x05;
export const Arguments = 2;
export const UsesText = true;
export const Description = "Show speech bubble at `arg_0`x`arg_1`. _Uses `text` attribute_.";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	const args = instruction.arguments;
	return SpeakText(instruction, engine, action);
};
