import { Variant, Yoda } from "src/engine/variant";

import { InputStream } from "src/util";
import { assert } from "../error";
import { Data, Character } from "../types";

const ICHA = "ICHA";
const parseCharacterFrame = (stream: InputStream, _: Data): Int16Array => {
	return stream.readInt16Array(0x8);
};

const parseCharacter = (stream: InputStream, data: Data, gameType: Variant): Character => {
	const marker = stream.readCharacters(4);
	assert(marker === ICHA, "Expected to find ICHA marker.", stream);
	// skip over size
	stream.readUint32();
	const name = stream.readCStringWithLength(0x10, "iso-8859-2");
	const type = stream.readInt16();
	const movementType = stream.readInt16();
	let probablyGarbage1 = 0;
	let probablyGarbage2 = 0;
	if (gameType === Yoda) {
		probablyGarbage1 = stream.readInt16();
		probablyGarbage2 = stream.readUint32();
	}

	const frame1 = parseCharacterFrame(stream, data);
	const frame2 = parseCharacterFrame(stream, data);
	const frame3 = parseCharacterFrame(stream, data);

	return {
		name,
		type,
		movementType,
		probablyGarbage1,
		probablyGarbage2,
		frame1,
		frame2,
		frame3,
		damage: -1,
		health: -1,
		reference: -1
	};
};

export const parseCharacters = (stream: InputStream, data: Data, type: Variant): void => {
	// skip over size
	stream.readUint32();
	const characters = [];

	do {
		const index = stream.readInt16();
		if (index === -1) break;

		characters.push(parseCharacter(stream, data, type));
	} while (true);

	data.characters = characters;
};

export const parseCharacterAux = (stream: InputStream, data: Data): void => {
	// skip over size
	stream.readUint32();

	do {
		const index = stream.readInt16();
		if (index === -1) break;

		parseCharacterAux1(stream, data, index);
	} while (true);
};

export const parseCharacterAux1 = (stream: InputStream, data: Data, index: number): void => {
	const damage = stream.readInt16();
	data.characters[index].damage = damage;
};

export const parseCharacterWeapon = (stream: InputStream, data: Data, index: number): void => {
	const reference = stream.readInt16();
	const health = stream.readInt16();

	data.characters[index].health = health;
	data.characters[index].reference = reference;
};

export const parseCharacterWeapons = (stream: InputStream, data: Data): void => {
	// skip over size
	stream.readUint32();

	do {
		const index = stream.readInt16();
		if (index === -1) break;

		parseCharacterWeapon(stream, data, index);
	} while (true);
};
