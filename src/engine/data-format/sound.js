import { uint8, uint16, uint32, character, structure, array } from "/parser";

export const sound = structure({
	length: uint16,
	name: array(character, (s, d) => d.length - 1),
	end: uint8
});

export const sounds = structure({
	size: uint32,
	count: uint16,
	items: array(sound, (s, d) => -1 * (d.count - 0x10000))
});
