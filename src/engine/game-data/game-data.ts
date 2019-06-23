import { Char, Puzzle, Sound, Tile, Zone } from "src/engine/objects";
import { GameType } from "../type";
import fromFileContents from "./from-file-contents";
import { Data as RawData } from "../file-format/types";

class GameData {
	private _type: GameType;
	private _rawInput: any;
	private _version: number;
	private _sounds: Sound[];
	private _tiles: Tile[];
	private _puzzles: Puzzle[];
	private _zones: Zone[];
	private _characters: Char[];
	private _setup: Uint8Array;

	constructor(raw: RawData) {
		fromFileContents(this, raw);
	}

	copy() {
		return new GameData(this._rawInput);
	}

	get type(): GameType {
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

	get setupImageData(): Uint8Array {
		return this._setup;
	}
}

export default GameData;