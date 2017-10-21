import Engine from "../../engine";
import Action from "../../objects/action";
import Instruction from "../../objects/instruction";
import { Flags as Result, InstructionResult } from "../arguments";

export const Opcode = 0x17;
export const Arguments = 1;
export const Description = "Enable NPC `arg_0`";
export default (instruction: Instruction, engine: Engine, action: Action): InstructionResult => {
	const zone = engine.currentZone;
	const npc = zone.npcs[instruction.arguments[0]];
	if (npc) {
		npc.enabled = true;
		return Result.UpdateHotspot;
	}

	return Result.OK;
};
