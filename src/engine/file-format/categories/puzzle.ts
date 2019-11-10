import { GameType, Yoda } from "src/engine/type";
import { InputStream } from "src/util";
import { assert } from "../error";
import { Data, Puzzle } from "../types";

const IPUZ = "IPUZ";

const parsePuzzle = (stream: InputStream, _: Data, gameType: GameType): Puzzle => {
	const marker = stream.readCharacters(4);
	assert(marker === IPUZ, "Expected to find category marker IPUZ", stream);
	// skip over size
	stream.readUint32();

	let type = 0;
	if (gameType === Yoda) {
		type = stream.readUint32();
	}

	const unknown1 = stream.readUint32();
	const unknown2 = stream.readUint32();
	const unknown3 = stream.readUint16();

	const texts: string[] = Array.Repeat("", 5);

	for (let i = 0; i < 5; i++) {
		texts[i] = stream.readLengthPrefixedString("iso-8859-2");
	}

	const item1 = stream.readUint16();
	let item2 = null;
	if (gameType === Yoda) {
		item2 = stream.readUint16();
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
	stream.readUint32();

	const puzzles = [];
	do {
		const index = stream.readInt16();
		if (index === -1) break;

		puzzles.push(parsePuzzle(stream, data, gameType));
	} while (true);
	data.puzzles = puzzles;
};

export const parsePuzzleNames = (stream: InputStream, data: Data): void => {
	// skip over size
	stream.readUint32();

	const count = stream.readInt16();
	for (let i = 0; i < count; i++) {
		data.puzzles[i].name = stream.readCStringWithLength(0x10, "iso-8859-2");
	}
};
