import { character, uint16, uint32, structure, array, until } from "/parser";

export const tileNames = structure({
	size: uint32,
	tileNames: until(uint16, 0xFFFF, array(character, 0x18)) // isYodaFile() ? 0x18 : 0x10
});
