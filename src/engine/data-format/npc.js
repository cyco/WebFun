import { structure, array, uint8, uint16, uint32 } from "/parser";

export const npc = structure({
	face: uint16,
	x: uint16,
	y: uint16,
	unknown1: uint16,
	unknown2: uint32,
	unknown3: array(uint8, 0x20)
});
