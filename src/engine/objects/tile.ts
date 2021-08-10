import TileAttributes from "./tile-attributes";
import { Tile as RawTile } from "src/engine/file-format/types";

export const WIDTH = 32;
export const HEIGHT = 32;
export const SIZE = WIDTH * HEIGHT;

class Tile {
	public static readonly WIDTH = WIDTH;
	public static readonly HEIGHT = HEIGHT;
	public static readonly SIZE = SIZE;
	public static readonly Attributes = TileAttributes;

	public id: number;
	public name: string;
	public attributes: number;
	public imageData: Uint8Array;

	public constructor(id: number, data: Tile | RawTile) {
		this.id = id;
		this.name = data.name ?? "";
		this.attributes = data.attributes;
		this.imageData = data instanceof Tile ? data.imageData : data.pixels;
	}

	public isOpaque(): boolean {
		return !this.hasAttributes(Tile.Attributes.Transparent);
	}

	public hasAttributes(mask: number): boolean {
		return (this.attributes & mask) === mask;
	}
}

declare namespace Tile {
	export type Attributes = TileAttributes;
}

export default Tile;
