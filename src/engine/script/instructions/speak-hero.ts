import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result } from "../types";
import SpeakText from "./speak-text";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x04,
	Arguments: [],
	UsesText: true,
	Description: "Show speech bubble next to hero. _Uses `text` attribute_.",
	Implementation: (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		return SpeakText(instruction.text, engine.hero.location, engine);
	}
};
