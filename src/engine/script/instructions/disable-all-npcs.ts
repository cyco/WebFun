import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x1a,
	Arguments: [],
	Description: "Disable all NPCs",
	Implementation: async (instruction: Instruction, engine: Engine, action: Action): Promise<Result> => {
		const zone = engine.currentZone;
		zone.npcs.forEach((npc) => npc.enabled = true);

		return ResultFlags.UpdateNPC;
	}
};
