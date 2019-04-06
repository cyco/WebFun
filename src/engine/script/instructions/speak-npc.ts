import { Result, Type } from "../types";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";
import InstructionType from "../instruction";
import { Point } from "src/util";
import SpeakText from "./speak-text";

export default {
	Opcode: 0x05,
	Arguments: [Type.ZoneX, Type.ZoneY],
	UsesText: true,
	Description:
		"Show speech bubble at `arg_0`x`arg_1`. _Uses `text` attribute_. The characters `¢` and `¥` are used as placeholders for provided and required items of the current zone, respectively.",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		const args = instruction.arguments;
		return SpeakText(instruction.text, new Point(args[0], args[1]), engine);
	}
} as InstructionType;
