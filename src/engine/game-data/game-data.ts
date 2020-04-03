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

	public copy() {
		return new GameData(this._rawInput);
	}

	public resetAfterWorldGeneration() {
		// TODO: UNDO
		// const puzzle: MutablePuzzle = this._assets.get(Puzzle, Yoda.goalIDs.RESCUE_YODA) as any;
		// puzzle.type = Puzzle.Type.End;
		// TODO: UNDO
		// const puzzle: MutablePuzzle = this._assets.get(Puzzle, Yoda.goalIDs.CAR) as any;
		// puzzle.type = Puzzle.Type.End;
		this._zones.forEach((zone, zoneId) => {
			const originalZone = this._rawInput.zones[zoneId];
			zone.hotspots.forEach((hotspot, hotspotId) => {
				const originalHotspot = originalZone.hotspots[hotspotId];
				hotspot.enabled = originalHotspot.enabled;
				hotspot.arg = originalHotspot.argument;
			});
		});
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
