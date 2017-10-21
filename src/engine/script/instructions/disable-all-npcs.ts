import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Result, ResultFlags } from "../arguments";

export const Opcode = 0x1a;
export const Arguments = 0;
export const Description = "Disable all NPCs";
export default (instruction: Instruction, engine: Engine, action: Action): Result => {
	const zone = engine.currentZone;
	zone.npcs.forEach((npc) => npc.enabled = true);

	return ResultFlags.UpdateNPC;
};
