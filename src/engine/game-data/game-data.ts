import { Char, Puzzle, Sound, Tile, Zone } from "src/engine/objects";
import Variant from "../variant";
import fromFileContents from "./from-file-contents";
import { Data as RawData } from "../file-format/types";

class GameData {
	private _type: Variant;
	private _rawInput: any;
	private _version: number;
	private _sounds: Sound[];
	private _tiles: Tile[];
	private _puzzles: Puzzle[];
	private _zones: Zone[];
	private _characters: Char[];
	private _startup: Uint8Array;

	constructor(raw: RawData) {
		fromFileContents(this, raw);
	}

	public copy(): GameData {
		return new GameData(this._rawInput);
	}

	get type(): Variant {
		return this._type;
	}

	get version(): number {
		return this._version;
	}

	get sounds(): Sound[] {
		return this._sounds;
	}

	get tiles(): Tile[] {
		return this._tiles;
	}

	get puzzles(): Puzzle[] {
		return this._puzzles;
	}

	get zones(): Zone[] {
		return this._zones;
	}

	get characters(): Char[] {
		return this._characters;
	}

	get startupImageData(): Uint8Array {
		return this._startup;
	}
}

export default GameData;
