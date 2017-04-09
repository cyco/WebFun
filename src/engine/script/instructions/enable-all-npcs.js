import * as Result from "../result";

export default (instruction, engine, action) => {
	const zone = engine.currentZone;
	zone.npcs.forEach((npc) => npc.enabled = false);

	return zone.npcs.count ? Result.UpdateNPC : Result.OK;
};
