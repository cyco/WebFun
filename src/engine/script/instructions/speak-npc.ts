import { InstructionResult } from "../arguments";
import Instruction from "../../objects/instruction";
import Engine from "../../engine";
import Action from "../../objects/action";
import SpeakText from "./speak-text";
import { Point } from "src/util";

export const Opcode = 0x05;
export const Arguments = 2;
export const UsesText = true;
export const Description = "Show speech bubble at `arg_0`x`arg_1`. _Uses `text` attribute_.";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	const args = instruction.arguments;
	return SpeakText(instruction.text, new Point(args[0], args[1]), engine);
};
