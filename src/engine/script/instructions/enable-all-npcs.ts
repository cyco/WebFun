import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Flags as Result, InstructionResult } from "../arguments";

export const Opcode = 0x19;
export const Arguments = 0;
export const Description = "Enable all NPCs";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	const zone = engine.currentZone;
	zone.npcs.forEach((npc) => npc.enabled = false);

	return zone.npcs.length ? Result.UpdateNPC : Result.OK;
};
