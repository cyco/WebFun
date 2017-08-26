import * as Result from "../result";

export const Opcode = 0x18;
export const Arguments = 1;
export const Description = "Disable NPC `arg_0`";
export default (instruction, engine, action) => {
	const zone = engine.currentZone;
	const npc = zone.npcs[instruction.arguments[0]];
	if (npc) {
		npc.enabled = false;
		return Result.UpdateHotspot;
	}

	return Result.OK;
};
