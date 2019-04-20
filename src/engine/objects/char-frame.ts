import Tile from "src/engine/objects/tile";

export const enum CharFrameEntry {
	Up = 0,
	Down = 1,
	ExtensionUp = 2,
	Left = 3,
	ExtensionDown = 4,
	ExtensionLeft = 5,
	Right = 6,
	ExtensionRight = 7
}

class CharFrame {
	private _tiles: Tile[];

	constructor(tiles: Tile[]) {
		this._tiles = tiles;
	}

	get tiles() {
		return this._tiles;
	}

	get up() {
		return this._tiles[CharFrameEntry.Up];
	}

	get down() {
		return this._tiles[CharFrameEntry.Down];
	}

	get extensionUp() {
		return this._tiles[CharFrameEntry.ExtensionUp];
	}

	get left() {
		return this._tiles[CharFrameEntry.Left];
	}

	get extensionDown() {
		return this._tiles[CharFrameEntry.ExtensionDown];
	}

	get extensionLeft() {
		return this._tiles[CharFrameEntry.ExtensionLeft];
	}

	get right() {
		return this._tiles[CharFrameEntry.Right];
	}

	get extensionRight() {
		return this._tiles[CharFrameEntry.ExtensionRight];
	}
}

export default CharFrame;
