import Tile from "./tile";
import { CharacterFrameEntry } from "./character-frame-entry";

class CharacterFrame {
	public tiles: Tile[];

	constructor(tiles: Tile[]) {
		this.tiles = tiles;
	}

	get up(): Tile {
		return this.tiles[CharacterFrameEntry.Up];
	}

	get down(): Tile {
		return this.tiles[CharacterFrameEntry.Down];
	}

	get extensionUp(): Tile {
		return this.tiles[CharacterFrameEntry.ExtensionUp];
	}

	get left(): Tile {
		return this.tiles[CharacterFrameEntry.Left];
	}

	get extensionDown(): Tile {
		return this.tiles[CharacterFrameEntry.ExtensionDown];
	}

	get extensionLeft(): Tile {
		return this.tiles[CharacterFrameEntry.ExtensionLeft];
	}

	get right(): Tile {
		return this.tiles[CharacterFrameEntry.Right];
	}

	get extensionRight(): Tile {
		return this.tiles[CharacterFrameEntry.ExtensionRight];
	}
}

export default CharacterFrame;
