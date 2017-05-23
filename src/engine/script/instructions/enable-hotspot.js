import * as Result from "../result";

export const Opcode = 0x16;
export const Arguments = 1;
export default (instruction, engine, action) => {
	const zone = engine.currentZone;
	const hotspot = zone.hotspots[instruction.arguments[0]];
	if (hotspot)
		hotspot.enabled = true;

	return Result.UpdateHotspot;
};
