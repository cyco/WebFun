import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x18,
	Arguments: [Type.NPCID],
	Description: "Disable NPC `arg_0`",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		const zone = engine.currentZone;
		const npc = zone.npcs[instruction.arguments[0]];
		if (npc) {
			npc.enabled = false;
			return ResultFlags.UpdateHotspot;
		}

		return ResultFlags.OK;
	}
};
