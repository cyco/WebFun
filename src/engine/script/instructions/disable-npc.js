import * as Result from '../result';

export default (instruction, engine, action) => {
	const zone = engine.state.currentZone;
	const npc = zone.npcs[instruction.arguments[0]];
	if (npc) {
		npc.enabled = false;
		return Result.UpdateHotspot;
	}

	return Result.OK;
};
