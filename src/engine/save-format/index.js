import { uint32, uint16, character, structure, array } from "/parser";

export default structure({
	magic: array(character, 9),
	seed: uint32,
	planet: uint32,
	unknown: uint32,
	puzzleIDs1: array(uint16, uint16),
	puzzleIDs2: array(uint16, uint16)


});

