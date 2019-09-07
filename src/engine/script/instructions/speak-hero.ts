import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

import { Result } from "../types";

export default {
	Opcode: 0x04,
	Arguments: [],
	UsesText: true,
	Description: "Show speech bubble next to hero. _Uses `text` attribute_.",
	Implementation: async (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		await engine.speak(instruction.text, engine.hero.location);
		return Result.Void;
	}
};
