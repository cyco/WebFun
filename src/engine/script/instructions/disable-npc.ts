import { Result, Type } from "../types";

import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";

export default {
	Opcode: 0x18,
	Arguments: [Type.NPCID],
	Description: "Disable NPC `arg_0`",
	Implementation: async (instruction: Instruction, _: Engine, action: Action): Promise<Result> => {
		const zone = action.zone;
		const npc = zone.npcs[instruction.arguments[0]];
		if (npc) {
			npc.enabled = false;
			return Result.Void;
		}

		return Result.Void;
	}
};
