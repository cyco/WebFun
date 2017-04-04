import * as Result from '../result';

export default (instruction, engine, action) => {
	const zone = engine.state.currentZone;
	const hotspot = zone.hotspots[instruction.arguments[0]];
	if (hotspot) {
		hotspot.enabled = false;
		return Result.UpdateHotspot;
	}
	
	return Result.OK;
};
