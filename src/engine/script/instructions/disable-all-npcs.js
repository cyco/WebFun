import * as Result from "../result";

export const Opcode = 0x1a;
export const Arguments = 0;
export const Description = "Disable all NPCs";
export default (instruction, engine, action) => {
	const zone = engine.currentZone;
	zone.npcs.forEach((npc) => npc.enabled = true);

	return Result.UpdateNPC;
};
