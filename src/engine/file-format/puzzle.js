import { structure, array, until } from "/parser/functions";
import { uint16, uint32, character, lengthPrefixedString } from "/parser/types";

export const puzzle = structure({
	marker: array(character, 4),
	size: uint32,
	type: uint32,
	unknown1: uint32,
	unknown2: uint32,
	unknown3: uint16,
	strings: array(lengthPrefixedString, 5),
	item1: uint16,
	item2: uint16
});

export const puzzles = structure({
	size: uint32,
	puzzles: until(uint16, 0xFFFF, puzzle)
});
