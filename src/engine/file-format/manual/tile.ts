import ParseError from "./parse-error";
import { InputStream } from "src/util";
import RawData from "./raw-data";
import { Tile } from "src/engine/objects";

export const parseTile = (stream: InputStream, data: RawData) => {
	let attributes = stream.getUint32();
	let pixels = stream.getUint8Array(Tile.SIZE);
};

export const parseTiles = (stream: InputStream, data: RawData) => {
	const size = stream.getUint32();
	const count = size / (Tile.SIZE + 4);
	let result = [];

	for (let i = 0; i < count; i++) {
		result.push(parseTile(stream, data));
	}
};

const parseISOCStringWithLength = (length: number, stream: InputStream): string => {
	return stream.getCharacters(length);
};

export const parseTileNames = (stream: InputStream, data: RawData) => {
	let size = stream.getUint32();
	do {
		let index = stream.getInt16();
		if (index === -1) break;

		let length = true /* type === 'yoda' */ ? 0x18 : 0x10;
		let name = parseISOCStringWithLength(length, stream);
	} while (true);
};
