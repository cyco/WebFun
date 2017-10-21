import { Point } from "src/util";
import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result } from "../arguments";
import SpeakText from "./speak-text";

export const Opcode = 0x05;
export const Arguments = 2;
export const UsesText = true;
export const Description = "Show speech bubble at `arg_0`x`arg_1`. _Uses `text` attribute_.";
export default (instruction: Instruction, engine: Engine, action: Action): Result => {
	const args = instruction.arguments;
	return SpeakText(instruction.text, new Point(args[0], args[1]), engine);
};
