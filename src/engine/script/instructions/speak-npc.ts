import { Point } from "src/util";
import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import SpeakText from "./speak-text";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x05,
	Arguments: [Type.ZoneX, Type.ZoneY],
	UsesText: true,
	Description: "Show speech bubble at `arg_0`x`arg_1`. _Uses `text` attribute_.",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		const args = instruction.arguments;
		return SpeakText(instruction.text, new Point(args[0], args[1]), engine);
	}
};
