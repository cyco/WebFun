import { InstructionResult } from "../arguments";
import Instruction from "../../objects/instruction";
import Engine from "../../engine";
import Action from "../../objects/action";
import SpeakText from "./speak-text";

export const Opcode = 0x04;
export const Arguments = 0;
export const UsesText = true;
export const Description = "Show speech bubble next to hero. _Uses `text` attribute_.";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	return SpeakText(instruction, engine.hero.location, action);
};
