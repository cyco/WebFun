import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

import { Result } from "../types";

export default {
	Opcode: 0x1e,
	Arguments: [],
	Implementation: async (_: Instruction, engine: Engine, action: Action): Promise<Result> => {
		const sector = engine.currentWorld.findSectorContainingZone(action.zone);
		sector.solved1 = true;
		sector.solved2 = true;
		sector.solved3 = true;
		sector.solved4 = true;

		return Result.Void;
	}
};
