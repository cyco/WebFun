import { uint16, uint32, int16, structure } from "/parser";

export const hotspot = structure({
	type: uint32,
	x: uint16,
	y: uint16,
	enabled: uint16,
	arg: int16
});
