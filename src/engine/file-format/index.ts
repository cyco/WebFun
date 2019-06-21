import { GameType } from "src/engine";
import { InputStream } from "src/util";
import ParseError from "./parse-error";
import { error } from "./error";
import { Data } from "./types";
import dispatch from "./dispatch";

const ENDF = "ENDF";

export default (input: InputStream, type: GameType): Data => {
	const data: Data = {
		version: 0,
		setup: new Uint8Array(0),
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
		category = input.getCharacters(4);
		const parse = dispatch[category] || (() => error(`Invalid category ${category} found.`, input));
		parse(input, data, type);
	} while (category !== ENDF);

	console.assert(
		input.isAtEnd(),
		`0x${(input.length - input.offset).toString(0x10)} unknown bytes at end of stream!`
	);

	return data;
};

export { ParseError, Data };
