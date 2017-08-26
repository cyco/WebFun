import * as Result from "../result";

export const Opcode = 0x19;
export const Arguments = 0;
export const Description = "Enable all NPCs";
export default (instruction, engine, action) => {
	const zone = engine.currentZone;
	zone.npcs.forEach((npc) => npc.enabled = false);

	return zone.npcs.count ? Result.UpdateNPC : Result.OK;
};
