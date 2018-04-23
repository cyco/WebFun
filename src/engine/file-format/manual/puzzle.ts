import ParseError from "./parse-error";
import { InputStream } from "src/util";
import RawData from "./raw-data";
import { assert } from "../error";
import { GameType, Yoda } from "src/engine/type";

const IPUZ = "IPUZ";
const parsePuzzle = (stream: InputStream, data: RawData, gameType: GameType) => {
	let marker = stream.getCharacters(4);
	assert(marker == IPUZ, "Expected to find category marker IPUZ", stream);
	let size = stream.getUint32();
	if (gameType === Yoda) {
		let type = stream.getUint32();
	}

	let unknown1 = stream.getUint32();
	let unknown2 = stream.getUint32();
	let unknown3 = stream.getUint16();

	for (let i = 0; i < 5; i++) {
		let length = stream.getUint16();
		let text = stream.getCharacters(length);
	}

	let item1 = stream.getUint16();
	let item2 = null;
	if (gameType === Yoda) {
		item2 = stream.getUint16();
	}
};

export const parsePuzzles = (stream: InputStream, data: RawData, gameType: GameType) => {
	let size = stream.getUint32();
	do {
		let index = stream.getInt16();
		if (index === -1) break;

		parsePuzzle(stream, data, gameType);
	} while (true);
};

export const parsePuzzleNames = (stream: InputStream) => {
	let size = stream.getUint32();
	let data = stream.getUint8Array(size);
};
