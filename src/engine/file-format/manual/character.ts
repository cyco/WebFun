import ParseError from "./parse-error";
import { InputStream } from "src/util";
import { Tile } from "src/engine/objects";
import { assert } from "../error";
import { GameType, Yoda } from "src/engine/type";

const ICHA = "ICHA";
const parseCharacterFrame = (stream: InputStream, data: any) => {
	return stream.getInt16Array(0x8);
};

const parseStringWithLength = (stream: InputStream, length: number): String => {
	return stream.getCharacters(length).split("\0")[0];
};

const parseCharacter = (stream: InputStream, data: any, gameType: GameType) => {
	const marker = stream.getCharacters(4);
	assert(marker === ICHA, "Expected to find ICHAR marker.", stream);
	let size = stream.getUint32();
	let name = parseStringWithLength(stream, 16);
	let type = stream.getInt16();
	let movementType = stream.getInt16();
	let probablyGarbage1 = 0;
	let probablyGarbage2 = 0;
	if (gameType === Yoda) {
		probablyGarbage1 = stream.getInt16();
		probablyGarbage2 = stream.getUint32();
	}

	let frame1 = parseCharacterFrame(stream, data);
	let frame2 = parseCharacterFrame(stream, data);
	let frame3 = parseCharacterFrame(stream, data);

	return {
		name,
		type,
		movementType,
		probablyGarbage1,
		probablyGarbage2,
		frame1,
		frame2,
		frame3
	};
};

export const parseCharacters = (stream: InputStream, data: any, type: GameType) => {
	let size = stream.getUint32();
	let characters = [];

	do {
		let index = stream.getInt16();
		if (index === -1) break;

		characters.push(parseCharacter(stream, data, type));
	} while (true);

	data.characters = characters;
};

export const parseCharacterAux = (stream: InputStream, data: any) => {
	let size = stream.getUint32();
	let success: boolean;
	do {
		let index = stream.getInt16();
		if (index === -1) break;

		parseCharacterAux1(stream, data);
	} while (true);
};

export const parseCharacterAux1 = (stream: InputStream, data: any) => {
	let damage = stream.getInt16();
};

export const parseCharacterWeapon = (stream: InputStream, data: any) => {
	let reference = stream.getInt16();
	let health = stream.getInt16();
};

export const parseCharacterWeapons = (stream: InputStream, data: any): void => {
	let size = stream.getUint32();
	do {
		let index = stream.getInt16();
		if (index === -1) break;

		parseCharacterWeapon(stream, data);
	} while (true);
};
