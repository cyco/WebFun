import * as Result from "../result";

export const Opcode = 0x15;
export const Arguments = 1;
export default (instruction, engine, action) => {
	const zone = engine.currentZone;
	const hotspot = zone.hotspots[instruction.arguments[0]];
	if (hotspot) {
		hotspot.enabled = false;
		return Result.UpdateHotspot;
	}

	return Result.OK;
};
