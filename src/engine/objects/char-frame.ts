import Tile from "./tile";
import { CharFrameEntry } from "./char-frame-entry";

class CharFrame {
	public tiles: Tile[];

	constructor(tiles: Tile[]) {
		this.tiles = tiles;
	}

	get up(): Tile {
		return this.tiles[CharFrameEntry.Up];
	}

	get down(): Tile {
		return this.tiles[CharFrameEntry.Down];
	}

	get extensionUp(): Tile {
		return this.tiles[CharFrameEntry.ExtensionUp];
	}

	get left(): Tile {
		return this.tiles[CharFrameEntry.Left];
	}

	get extensionDown(): Tile {
		return this.tiles[CharFrameEntry.ExtensionDown];
	}

	get extensionLeft(): Tile {
		return this.tiles[CharFrameEntry.ExtensionLeft];
	}

	get right(): Tile {
		return this.tiles[CharFrameEntry.Right];
	}

	get extensionRight(): Tile {
		return this.tiles[CharFrameEntry.ExtensionRight];
	}
}

export default CharFrame;
