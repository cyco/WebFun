import { uint8, uint16, uint32, character, structure, array, until } from "/parser";

export const char = structure({
	marker: array(character, 4),
	blob: array(uint8, uint32)
});

export const charWeapon = structure({
	data: array(uint8, 4)
});

export const charAux = structure({
	data: array(uint8, 2)
});

export const characters = structure({
	size: uint32,
	characters: until(uint16, 0xFFFF, char)
});

export const characterWeapons = structure({
	size: uint32,
	weaponData: until(uint16, 0xFFFF, charWeapon)
});

export const characterAuxiliaries = structure({
	size: uint32,
	auxData: until(uint16, 0xFFFF, charAux)
});
