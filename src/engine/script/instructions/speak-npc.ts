import { Result, Type } from "../types";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";

import { Point } from "src/util";

export default {
	Opcode: 0x05,
	Arguments: [Type.ZoneX, Type.ZoneY],
	UsesText: true,
	Description:
		"Show speech bubble at `arg_0`x`arg_1`. _Uses `text` attribute_. The characters `¢` and `¥` are used as placeholders for provided and required items of the current zone, respectively.",
	Implementation: (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		const [x, y] = instruction.arguments;
		engine.speak(instruction.text, new Point(x, y));
		return Promise.resolve(Result.UpdateText);
	}
};
