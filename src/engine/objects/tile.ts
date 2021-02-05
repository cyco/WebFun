import TileAttributes from "./tile-attributes";

export const WIDTH = 32;
export const HEIGHT = 32;
export const SIZE = WIDTH * HEIGHT;

class Tile {
	public static readonly WIDTH = WIDTH;
	public static readonly HEIGHT = HEIGHT;
	public static readonly SIZE = SIZE;
	public static readonly Attributes = TileAttributes;

	protected _id: number = 0;
	protected _name: string = "";
	protected _attributes: number = 0;
	protected _imageData: Uint8Array;

	public isOpaque(): boolean {
		return !this.hasAttributes(Tile.Attributes.Transparent);
	}

	public hasAttributes(mask: number): boolean {
		return (this._attributes & mask) === mask;
	}

	public get id(): number {
		return this._id;
	}

	public get name(): string {
		return this._name;
	}

	public get attributes(): number {
		return this._attributes;
	}

	public get imageData(): Uint8Array {
		return this._imageData;
	}
}

declare namespace Tile {
	export type Attributes = TileAttributes;
}

export default Tile;
