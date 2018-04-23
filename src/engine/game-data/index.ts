import { Uint8Array } from "src/std";
import { Tile, Puzzle, Zone, Char } from "src/engine/objects";

import fromKaitai from "./from-kaitai";
import fromHandwritten from "./from-handwritten";

class GameData {
	private _rawInput: any;
	private _version: number;
	private _sounds: string[];
	private _tiles: Tile[];
	private _puzzles: Puzzle[];
	private _zones: Zone[];
	private _characters: Char[];
	private _setup: Uint8Array;

	constructor(raw: any) {
		if (raw.catalog) fromKaitai(this, raw);
		else fromHandwritten(this, raw);
	}

	copy() {
		return new GameData(this._rawInput);
	}

	get version(): number {
		return this._version;
	}

	get sounds(): string[] {
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
