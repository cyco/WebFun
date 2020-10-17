import Tile from "./tile";
import { CharFrameEntry } from "./char-frame-entry";

class CharFrame {
	private _tiles: Tile[];

	constructor(tiles: Tile[]) {
		this._tiles = tiles;
	}

	get tiles(): Tile[] {
		return this._tiles;
	}

	get up(): Tile {
		return this._tiles[CharFrameEntry.Up];
	}

	get down(): Tile {
		return this._tiles[CharFrameEntry.Down];
	}

	get extensionUp(): Tile {
		return this._tiles[CharFrameEntry.ExtensionUp];
	}

	get left(): Tile {
		return this._tiles[CharFrameEntry.Left];
	}

	get extensionDown(): Tile {
		return this._tiles[CharFrameEntry.ExtensionDown];
	}

	get extensionLeft(): Tile {
		return this._tiles[CharFrameEntry.ExtensionLeft];
	}

	get right(): Tile {
		return this._tiles[CharFrameEntry.Right];
	}

	get extensionRight(): Tile {
		return this._tiles[CharFrameEntry.ExtensionRight];
	}
}

export default CharFrame;
