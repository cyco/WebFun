import SpeakText from "./speak-text";

export default (instruction, engine, action) => {
	return SpeakText(instruction.text, engine.hero.location, engine);
};
