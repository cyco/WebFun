import { Variant } from "src/engine";
import { error } from "./error";
import { Data } from "./types";
import dispatch from "./dispatch";
import { ReaderStream } from "src/util";

const ENDF = "ENDF";
export default function* (input: ReaderStream, type: Variant): Generator<Data> {
	const data: Data = {
		version: null,
		startup: null,
		sounds: [],
		tiles: [],
		zones: [],
		puzzles: [],
		characters: [],
		end: 0,
		type
	};

	let category: string;

	do {
		// wait for enough data to read category and size
		while (input.bytesAvailable < 8) yield data;
		const category = input.readCharacters(4);
		const size = input.readUint32();

		if (category === "VERS") data.version = size;
		if (category === "STUP") {
			while (input.bytesAvailable < size) yield data;
			data.startup = input.readUint8Array(size);
			yield data;
			break;
		}
	} while (true);

	// wait until stream is read to the end
	while (!input.done) yield data;

	do {
		category = input.readCharacters(4);
		const parse = dispatch[category] || (() => error(`Invalid category ${category} found.`, input));
		parse(input, data, type);
	} while (category !== ENDF);

	console.assert(
		input.isAtEnd(),
		`0x${(input.length - input.offset).toString(0x10)} unknown bytes at end of stream!`
	);

	return data;
}
