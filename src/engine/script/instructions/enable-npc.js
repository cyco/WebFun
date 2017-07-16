import * as Result from "../result";

export const Opcode = 0x17;
export const Arguments = 1;
export const Description = 'Enable NPC `arg_0`';
export default (instruction, engine, action) => {
	const zone = engine.currentZone;
	const npc = zone.npcs[instruction.arguments[0]];
	if (npc) {
		npc.enabled = true;
		return Result.UpdateHotspot;
	}

	return Result.OK;
};
