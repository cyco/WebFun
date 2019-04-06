import Action from "../../objects/action";
import Engine from "../../engine";
import Instruction from "../../objects/instruction";
import InstructionType from "../instruction";
import { Result } from "../types";

export default {
	Opcode: 0x1a,
	Arguments: [],
	Description: "Disable all NPCs",
	Implementation: async (_: Instruction, _engine: Engine, action: Action): Promise<Result> => {
		const zone = action.zone;
		zone.npcs.forEach(npc => (npc.enabled = true));

		return Result.Void;
	}
} as InstructionType;
