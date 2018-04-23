import ParseError from "./parse-error";
import { InputStream } from "src/util";
import RawData from "./raw-data";
import { Tile } from "src/engine/objects";
import { assert } from "../error";

const ICHA = "ICHA";
const parseCharacterFrame = (stream: InputStream, data: RawData) => {
	stream.getInt16Array(0x8);
};
const parseStringWithLength = (stream: InputStream, length: number): String => {
	return stream.getCharacters(length).split("\0")[0];
};

const parseCharacter = (stream: InputStream, data: RawData) => {
	const marker = stream.getCharacters(4);
	assert(marker === ICHA, "Expected to find ICHAR marker.", stream);
	let size = stream.getUint32();
	let name = parseStringWithLength(stream, 16);
	let type = stream.getInt16();
	let movement_type = stream.getInt16();
	if (true /* game_type === 'yoda'*/) {
		let probablyGarbage1 = stream.getInt16();
		let probablyGarbage2 = stream.getUint32();
	}

	let frame1 = parseCharacterFrame(stream, data);
	let frame2 = parseCharacterFrame(stream, data);
	let frame3 = parseCharacterFrame(stream, data);
};

export const parseCharacters = (stream: InputStream, data: RawData) => {
	let size = stream.getUint32();
	do {
		let index = stream.getInt16();
		if (index === -1) break;

		parseCharacter(stream, data);
	} while (true);
};

export const parseCharacterAux = (stream: InputStream, data: RawData) => {
	let size = stream.getUint32();
	let success: boolean;
	do {
		let index = stream.getInt16();
		if (index === -1) break;

		parseCharacterAux1(stream, data);
	} while (true);
};

export const parseCharacterAux1 = (stream: InputStream, data: RawData) => {
	let damage = stream.getInt16();
};

export const parseCharacterWeapon = (stream: InputStream, data: RawData) => {
	let reference = stream.getInt16();
	let health = stream.getInt16();
};

export const parseCharacterWeapons = (stream: InputStream, data: RawData): void => {
	let size = stream.getUint32();
	do {
		let index = stream.getInt16();
		if (index === -1) break;

		parseCharacterWeapon(stream, data);
	} while (true);
};
