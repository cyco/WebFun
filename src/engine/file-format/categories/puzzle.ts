import { GameType, Yoda } from "src/engine/type";
import { InputStream } from "src/util";
import { assert } from "../error";
import { Data, Puzzle } from "../types";

const IPUZ = "IPUZ";

const parsePuzzle = (stream: InputStream, _: Data, gameType: GameType): Puzzle => {
	const marker = stream.getCharacters(4);
	assert(marker === IPUZ, "Expected to find category marker IPUZ", stream);
	// skip over size
	stream.getUint32();

	let type = 0;
	if (gameType === Yoda) {
		type = stream.getUint32();
	}

	const unknown1 = stream.getUint32();
	const unknown2 = stream.getUint32();
	const unknown3 = stream.getUint16();

	const texts: string[] = Array.Repeat("", 5);

	for (let i = 0; i < 5; i++) {
		texts[i] = stream.getLengthPrefixedString("iso-8859-2");
	}

	const item1 = stream.getUint16();
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

export const parsePuzzles = (stream: InputStream, data: Data, gameType: GameType): void => {
	// skip over size
	stream.getUint32();

	const puzzles = [];
	do {
		const index = stream.getInt16();
		if (index === -1) break;

		puzzles.push(parsePuzzle(stream, data, gameType));
	} while (true);
	data.puzzles = puzzles;
};

export const parsePuzzleNames = (stream: InputStream, data: Data): void => {
	// skip over size
	stream.getUint32();

	const count = stream.getInt16();
	for (let i = 0; i < count; i++) {
		data.puzzles[i].name = stream.getCStringWithLength(0x10, "iso-8859-2");
	}
};
