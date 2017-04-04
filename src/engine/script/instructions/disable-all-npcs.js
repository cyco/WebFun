import * as Result from '../result';

export default (instruction, engine, action) => {
	const zone = engine.state.currentZone;
	zone.npcs.forEach((npc) => npc.enabled = true);
	
	return Result.UpdateNPC;
};
