import { Tile } from "src/engine/objects";

class MutableTile extends Tile {
	public get id() {
		return this._id;
	}

	public set id(value) {
		this._id = value;
	}

	public get name() {
		return this._name;
	}

	public set name(value) {
		this._name = value;
	}

	public get attributes() {
		return this._attributes;
	}

	public set attributes(value) {
		this._attributes = value;
	}

	public get imageData() {
		return this._imageData;
	}

	public set imageData(value) {
		this._imageData = value;
	}
}

export default MutableTile;
