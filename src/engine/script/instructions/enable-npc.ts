import { Result, Type } from "../types";

import Engine from "../../engine";
import { Action, Instruction } from "src/engine/objects";

export default {
	Opcode: 0x17,
	Arguments: [Type.NPCID],
	Description: "Enable NPC `arg_0`",
	Implementation: async (instruction: Instruction, _: Engine, action: Action): Promise<Result> => {
		const zone = action.zone;
		const npc = zone.npcs[instruction.arguments[0]];
		if (npc) {
			npc.enabled = true;
			return Result.Void;
		}

		return Result.Void;
	}
};
