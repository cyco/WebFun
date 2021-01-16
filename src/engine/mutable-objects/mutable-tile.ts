import { Tile } from "src/engine/objects";

class MutableTile extends Tile {
	public get id(): number {
		return this._id;
	}

	public set id(value: number) {
		this._id = value;
	}

	public get name(): string {
		return this._name;
	}

	public set name(value: string) {
		this._name = value;
	}

	public get attributes(): number {
		return this._attributes;
	}

	public set attributes(value: number) {
		this._attributes = value;
	}

	public get imageData(): Uint8Array {
		return this._imageData;
	}

	public set imageData(value: Uint8Array) {
		this._imageData = value;
	}
}

export default MutableTile;
