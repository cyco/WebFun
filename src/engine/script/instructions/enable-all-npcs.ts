import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

import { Result } from "../types";

export default {
	Opcode: 0x19,
	Arguments: [],
	Description: "Enable all NPCs",
	Implementation: async (_: Instruction, _engine: Engine, action: Action): Promise<Result> => {
		const zone = action.zone;
		zone.npcs.forEach(npc => (npc.enabled = false));

		return Result.Void;
	}
};
