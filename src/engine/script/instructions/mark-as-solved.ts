import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";

import { Result } from "../types";

export default {
	Opcode: 0x1e,
	Arguments: [],
	Implementation: async (_: Instruction, engine: Engine, action: Action): Promise<Result> => {
		action.zone.solved = true;

		const worldItem = engine.currentWorld.itemForZone(action.zone);
		worldItem.zone.solved = true;

		return Result.Void;
	}
};
