import SpeakText from "./speak-text";

export const Opcode = 0x04;
export const Arguments = 0;
export const UsesText = true;
export const Description = "Show speech bubble next to hero. _Uses `text` attribute_.";
export default (instruction, engine, action) => {
	return SpeakText(instruction.text, engine.hero.location, engine);
};
