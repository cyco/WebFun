import { Result, Type } from "../types";

import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

import { Point } from "src/util";

export default {
	Opcode: 0x05,
	Arguments: [Type.ZoneX, Type.ZoneY],
	UsesText: true,
	Description:
		"Show speech bubble at `arg_0`x`arg_1`. _Uses `text` attribute_. The characters `¢` and `¥` are used as placeholders for provided and required items of the current zone, respectively.",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		const [x, y] = instruction.arguments;
		await engine.speak(instruction.text, new Point(x, y));
		return Result.Void;
	}
};
