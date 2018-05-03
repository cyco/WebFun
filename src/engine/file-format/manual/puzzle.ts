import ParseError from "./parse-error";
import { InputStream } from "src/util";
import { assert } from "../error";
import { GameType, Yoda } from "src/engine/type";

const IPUZ = "IPUZ";
const parsePuzzle = (stream: InputStream, data: any, gameType: GameType) => {
	let marker = stream.getCharacters(4);
	assert(marker == IPUZ, "Expected to find category marker IPUZ", stream);
	let size = stream.getUint32();
	let type = 0;
	if (gameType === Yoda) {
		type = stream.getUint32();
	}

	let unknown1 = stream.getUint32();
	let unknown2 = stream.getUint32();
	let unknown3 = stream.getUint16();

	let texts = new Array(5);
	for (let i = 0; i < 5; i++) {
		let length = stream.getUint16();
		texts[i] = stream.getCharacters(length);
	}

	let item1 = stream.getUint16();
	let item2 = null;
	if (gameType === Yoda) {
		item2 = stream.getUint16();
	}

	return {
		name: "",
		type,
		unknown1,
		unknown2,
		unknown3,
		texts,
		item1,
		item2
	};
};

export const parsePuzzles = (stream: InputStream, data: any, gameType: GameType) => {
	let size = stream.getUint32();
	let puzzles = [];
	do {
		let index = stream.getInt16();
		if (index === -1) break;

		puzzles.push(parsePuzzle(stream, data, gameType));
	} while (true);
	data.puzzles = puzzles;
};

export const parsePuzzleNames = (stream: InputStream, data: any) => {
	let size = stream.getUint32();
	let count = stream.getInt16();
	for (let i = 0; i < count; i++) {
		let raw = stream.getCharacters(0x10);
		let length = 0;
		while (raw[length] !== "\0" && raw[length]) length++;
		data.puzzles[i].name = raw.substr(0, length);
	}
};
