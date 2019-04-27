import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";

import { Result } from "../types";

export default {
	Opcode: 0x04,
	Arguments: [],
	UsesText: true,
	Description: "Show speech bubble next to hero. _Uses `text` attribute_.",
	Implementation: (instruction: Instruction, engine: Engine, _: Action): Promise<Result> => {
		engine.speak(instruction.text, engine.hero.location);
		return Promise.resolve(Result.UpdateScene);
	}
};
