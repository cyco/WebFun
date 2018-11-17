import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../types";
import InstructionType from "../instruction";

export default <InstructionType>{
	Opcode: 0x19,
	Arguments: [],
	Description: "Enable all NPCs",
	Implementation: async (_: Instruction, engine: Engine, _action: Action): Promise<Result> => {
		const zone = engine.currentZone;
		zone.npcs.forEach(npc => (npc.enabled = false));

		return zone.npcs.length ? ResultFlags.UpdateNPC : ResultFlags.OK;
	}
};
