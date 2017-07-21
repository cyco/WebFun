import { Point } from "/util";
import SpeakText from "./speak-text";

export const Opcode = 0x05;
export const Arguments = 2;
export const UsesText = true;
export const Description = "Show speech bubble at `arg_0`x`arg_1`. _Uses `text` attribute_.";
export default (instruction, engine, action) => {
	const args = instruction.arguments;
	return SpeakText(instruction.text, new Point(args[0], args[1]), engine);
};
