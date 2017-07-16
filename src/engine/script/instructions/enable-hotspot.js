import * as Result from "../result";

export const Opcode = 0x15;
export const Arguments = 1;
export const Description = 'Enable hotspot `arg_0`';
export default (instruction, engine, action) => {
	const zone = engine.currentZone;
	const hotspot = zone.hotspots[instruction.arguments[0]];
	if (hotspot)
		hotspot.enabled = true;

	return Result.UpdateHotspot;
};
