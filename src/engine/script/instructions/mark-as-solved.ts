import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

import { Result } from "../types";

export default {
	Opcode: 0x1e,
	Arguments: [],
	Implementation: async (_: Instruction, engine: Engine, action: Action): Promise<Result> => {
		action.zone.solved = true;

		const sector = engine.currentWorld.itemForZone(action.zone);
		sector.zone.solved = true;

		return Result.Void;
	}
};
