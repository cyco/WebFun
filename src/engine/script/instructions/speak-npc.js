import Point from "/util/point";
import SpeakText from "./speak-text";

export default (instruction, engine, action) => {
	const args = instruction.arguments;
	return SpeakText(instruction.text, new Point(args[0], args[1]), engine);
};
