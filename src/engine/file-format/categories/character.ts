import { GameType, Yoda } from "src/engine/type";

import { InputStream } from "src/util";
import { assert } from "../error";

const ICHA = "ICHA";
const parseCharacterFrame = (stream: InputStream, _: any) => {
	return stream.getInt16Array(0x8);
};

const parseCharacter = (stream: InputStream, data: any, gameType: GameType) => {
	const marker = stream.getCharacters(4);
	assert(marker === ICHA, "Expected to find ICHAR marker.", stream);
	// skip over size
	stream.getUint32();
	const name = stream.getCStringWithLength(0x10, "iso-8859-2");
	const type = stream.getInt16();
	const movementType = stream.getInt16();
	let probablyGarbage1 = 0;
	let probablyGarbage2 = 0;
	if (gameType === Yoda) {
		probablyGarbage1 = stream.getInt16();
		probablyGarbage2 = stream.getUint32();
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

export const parseCharacters = (stream: InputStream, data: any, type: GameType) => {
	// skip over size
	stream.getUint32();
	const characters = [];

	do {
		const index = stream.getInt16();
		if (index === -1) break;

		characters.push(parseCharacter(stream, data, type));
	} while (true);

	data.characters = characters;
};

export const parseCharacterAux = (stream: InputStream, data: any) => {
	// skip over size
	stream.getUint32();

	do {
		const index = stream.getInt16();
		if (index === -1) break;

		parseCharacterAux1(stream, data, index);
	} while (true);
};

export const parseCharacterAux1 = (stream: InputStream, data: any, index: number) => {
	const damage = stream.getInt16();
	data.characters[index].damage = damage;
};

export const parseCharacterWeapon = (stream: InputStream, data: any, index: number) => {
	const reference = stream.getInt16();
	const health = stream.getInt16();

	data.characters[index].health = health;
	data.characters[index].reference = reference;
};

export const parseCharacterWeapons = (stream: InputStream, data: any): void => {
	// skip over size
	stream.getUint32();

	do {
		const index = stream.getInt16();
		if (index === -1) break;

		parseCharacterWeapon(stream, data, index);
	} while (true);
};
