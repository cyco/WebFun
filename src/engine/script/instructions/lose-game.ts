import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";

import { Result } from "../types";

export default {
	Opcode: 0x20,
	Arguments: [],
	Implementation: async (_instruction: Instruction, _engine: Engine, _: Action): Promise<Result> => {
		throw "Game Lost!";
	}
};
