import Tile from "src/engine/objects/tile";

class CharFrame {
	private _tiles: Tile[];

	constructor(tiles: Tile[]) {
		this._tiles = tiles;
	}

	get tiles() {
		return this._tiles;
	}

	get up() {
		return this._tiles[0];
	}

	get down() {
		return this._tiles[1];
	}

	get extensionUp() {
		return this._tiles[2];
	}

	get left() {
		return this._tiles[3];
	}

	get extensionDown() {
		return this._tiles[4];
	}

	get extensionLeft() {
		return this._tiles[5];
	}

	get right() {
		return this._tiles[6];
	}

	get extensionRight() {
		return this._tiles[7];
	}
}

export default CharFrame;
