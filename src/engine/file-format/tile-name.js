import { structure, array, until } from '/parser/functions';
import { character, uint16, uint32 } from '/parser/types';

export const tileNames = structure({
	size: uint32,
	tileNames: until(uint16, 0xFFFF, array(character, 0x18)) // isYodaFile() ? 0x18 : 0x10
});
