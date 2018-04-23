import ParseError from "./parse-error";
import { InputStream } from "src/util";
import RawData from "./raw-data";
import { assert } from "../error";

const IPUZ = "IPUZ";
const parsePuzzle = (stream: InputStream, data: RawData) => {
	let marker = stream.getCharacters(4);
	assert(marker == IPUZ, "Expected to find category marker IPUZ", stream);
	let size = stream.getUint32();
	if (true /* game_type === 'yoda' */) {
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
	if (true /* game_type === 'yoda'*/) {
		item2 = stream.getUint16();
	}
};

export const parsePuzzles = (stream: InputStream, data: RawData) => {
	let size = stream.getUint32();
	do {
		let index = stream.getInt16();
		if (index === -1) break;

		parsePuzzle(stream, data);
	} while (true);
};

export const parsePuzzleName = (stream: InputStream) => {
	let size = stream.getUint32();
	let data = stream.getUint8Array(size);
};
