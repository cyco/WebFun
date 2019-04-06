import { GameType, Yoda } from "src/engine/type";

import { InputStream } from "src/util";
import { Tile } from "src/engine/objects";

export const parseTile = (stream: InputStream, _: any) => {
	let attributes = stream.getUint32();
	let pixels = stream.getUint8Array(Tile.SIZE);

	return { attributes, pixels, name: "" };
};

export const parseTiles = (stream: InputStream, data: any) => {
	const size = stream.getUint32();
	const count = size / (Tile.SIZE + 4);

	let tiles = new Array(count);
	for (let i = 0; i < count; i++) {
		tiles[i] = parseTile(stream, data);
	}
	data.tiles = tiles;
};

export const parseTileNames = (stream: InputStream, data: any, gameType: GameType) => {
	// skip over size
	stream.getUint32();

	do {
		let index = stream.getInt16();
		if (index === -1) break;

		let length = gameType === Yoda ? 0x18 : 0x10;
		data.tiles[index].name = stream.getCStringWithLength(length, "iso-8859-2");
	} while (true);
};
