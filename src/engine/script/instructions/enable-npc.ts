import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, Type } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x17,
	Arguments: [Type.NPCID],
	Description: "Enable NPC `arg_0`",
	Implementation: async (instruction: Instruction, engine: Engine, _action: Action): Promise<Result> => {
		const zone = engine.currentZone;
		const npc = zone.npcs[instruction.arguments[0]];
		if (npc) {
			npc.enabled = true;
			return Result.OK;
		}

		return Result.OK;
	}
};
