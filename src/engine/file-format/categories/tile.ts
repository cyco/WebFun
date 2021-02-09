import { Variant, Yoda, YodaDemo } from "src/engine/variant";

import { InputStream } from "src/util";
import { Tile } from "src/engine/objects";
import { Tile as RawTile, Data } from "../types";

export const parseTile = (stream: InputStream, _: Data): RawTile => {
	const attributes = stream.readUint32();
	const pixels = stream.readUint8Array(Tile.SIZE);

	return { attributes, pixels, name: "" };
};

export const parseTiles = (stream: InputStream, data: Data): void => {
	const size = stream.readUint32();
	const count = size / (Tile.SIZE + 4);

	const tiles = new Array(count);
	for (let i = 0; i < count; i++) {
		tiles[i] = parseTile(stream, data);
	}
	data.tiles = tiles;
};

export const parseTileNames = (stream: InputStream, data: Data, variant: Variant): void => {
	// skip over size
	stream.readUint32();

	do {
		const index = stream.readInt16();
		if (index === -1) break;

		const length = variant === Yoda || variant === YodaDemo ? 0x18 : 0x10;
		data.tiles[index].name = stream.readCStringWithLength(length, "iso-8859-2");
	} while (true);
};
