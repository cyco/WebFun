import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x1a,
	Arguments: [],
	Description: "Disable all NPCs",
	Implementation: async (_: Instruction, engine: Engine, _action: Action): Promise<Result> => {
		const zone = engine.currentZone;
		zone.npcs.forEach(npc => (npc.enabled = true));

		return Result.UpdateNPC;
	}
};
