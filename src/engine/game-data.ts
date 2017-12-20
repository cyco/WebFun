import {
	Action,
	Char,
	CharFrame,
	CharMovementType,
	Condition,
	Hotspot,
	HotspotType,
	Instruction,
	NPC,
	Puzzle,
	PuzzleType,
	Tile,
	Zone,
	ZoneType
} from "./objects";

import {
	MutableNPC,
	MutableAction,
	MutableChar,
	MutablePuzzle,
	MutableTile,
	MutableZone
} from "src/engine/mutable-objects";

import { Planet } from "./types";
import { Size, Point } from "src/util";
import CharType from "src/engine/objects/char-type";

declare interface RawGameData {
	catalog: any[]
}

class GameData {
	private _rawInput: RawGameData;
	private _version: number;
	private _sounds: string[];
	private _tiles: Tile[];
	private _puzzles: Puzzle[];
	private _zones: Zone[];
	private _characters: Char[];
	private _setup: Uint8Array;

	constructor(raw: RawGameData) {
		this._rawInput = raw;
		this._version = this._getCategory("VERS").version;
		this._sounds = this._getCategory("SNDS").sounds
			.map((i: { content: string }) => i.content);
		this._tiles = this._getCategory("TILE").tiles
			.map((t: { attributes: number, pixels: Uint8Array }, i: number) => {
				const tile = new MutableTile();
				tile.id = i;
				tile.attributes = t.attributes;
				tile.imageData = t.pixels;
				return tile;
			});
		this._puzzles = this._getCategory("PUZ2").puzzles
			.filter(({ index }: { index: number }) => index !== -1)
			.map((data: any, index: number) => this._makePuzzle(data, index));
		this._characters = this._getCategory("CHAR").characters
			.filter(({ index }: { index: number }) => index !== -1)
			.map((data: any, index: number) => this._makeCharacter(data, index));

		this._zones = [];
		this._getCategory("ZONE").zones
			.map((data: any) => this._makeZone(data)).forEach((z: Zone) => this._zones.push(z));

		this._getCategory("CAUX").auxiliaries
			.filter(({ index }: { index: number }) => index !== -1)
			.forEach(({ damage }: { damage: number }, idx: number) => {
				const char = <MutableChar>this._characters[idx];
				char.damage = damage;
			});

		this._getCategory("CHWP").weapons
			.filter(({ index }: { index: number }) => index !== -1)
			.forEach(({ reference, health }: { reference: number, health: number }, idx: number) => {
				const char = <MutableChar>this._characters[idx];
				char.reference = reference;
				char.health = health;
			});
		this._getCategory("TNAM").names
			.filter(({ tileId }: { tileId: number }) => tileId !== -1)
			.forEach((nameSpecification: any) => {
				if (!nameSpecification.name) return;

				const tile = <MutableTile>this._tiles[nameSpecification.tileId];
				tile.name = nameSpecification.name;
			});
		this._setup = this._getCategory("STUP").pixels;
	}

	copy() {
		return new GameData(this._rawInput);
	}

	_getCategory(category: string) {
		const catalogEntry = this._rawInput.catalog.find(c => c.type === category);
		if (!catalogEntry) throw `Category ${category} not found in game file!`;

		return catalogEntry.content;
	}

	_makePuzzle(data: any, index: number): Puzzle {
		const puzzle = new MutablePuzzle();

		puzzle.id = index;
		puzzle.type = PuzzleType.fromNumber(data.type);
		puzzle.unknown1 = data.unknown1;
		puzzle.unknown2 = data.unknown2;
		puzzle.unknown3 = data.unknown3;

		puzzle.strings = data.strings.map((s: { content: string }) => s.content);
		puzzle.item1 = this._tiles[data.item1] ? this._tiles[data.item1] : null;
		puzzle.item2 = this._tiles[data.item2] ? this._tiles[data.item2] : null;

		if (puzzle.type !== PuzzleType.End && puzzle.type !== PuzzleType.Disabled) {
			puzzle.item2 = null;
		}

		if (index === 0xBD || index === 0xC5)
			puzzle.type = PuzzleType.Disabled;

		return puzzle;
	}

	_makeZone(data: any): Zone {
		const zone = new MutableZone();

		zone.id = data.index;
		zone.planet = Planet.fromNumber(data.planet);
		zone.size = new Size(data.width, data.height);
		zone.type = ZoneType.fromNumber(data.type);
		zone.tileIDs = data.tileIds;
		zone.hotspots = data.hotspots.map((d: any) => this._makeHotspot(d));
		zone.npcs = data.izax.npcs.map((d: any, idx: number) => this._makeNPC(d, idx));
		zone.goalItems = data.izax.goalItems.map((id: number) => this._tiles[id]);
		zone.requiredItems = data.izax.requiredItems.map((id: number) => this._tiles[id]);
		zone.providedItems = data.izx2.providedItems.map((id: number) => this._tiles[id]);
		zone.puzzleNPCs = data.izx3.puzzleNpc.map((id: number) => this._tiles[id]);
		zone.izaxUnknown = data.izax.unknownCount;
		zone.izx4Unknown = data.izx4.unknown;

		zone.actions = data.actions.map((data: any, i: number) => this._makeAction(data, i, zone));
		zone.tileStore = this.tiles;
		zone.zoneStore = this.zones;

		return zone;
	}

	_makeHotspot(data: any): Hotspot {
		const hotspot = new Hotspot();
		hotspot._x = data.x;
		hotspot._y = data.y;

		hotspot.enabled = !!data.enabled;
		hotspot.arg = data.argument;
		hotspot.type = HotspotType.fromNumber(data.type);

		switch (hotspot.type) {
			case HotspotType.TriggerLocation:
			case HotspotType.SpawnLocation:
			case HotspotType.ForceLocation:
			case HotspotType.LocatorThingy:
				hotspot.enabled = false;
				break;
			case HotspotType.VehicleTo:
			case HotspotType.VehicleBack:
			case HotspotType.DoorIn:
			case HotspotType.Lock:
			case HotspotType.xWingFromD:
			case HotspotType.xWingToD:
			case HotspotType.CrateItem:
			case HotspotType.PuzzleNPC:
			case HotspotType.CrateWeapon:
				hotspot.enabled = true;
				break;
			default:
				hotspot.arg = -1;
				hotspot.enabled = true;
				break;
		}

		return hotspot;
	}

	_makeAction(data: any, idx: number, zone: Zone): Action {
		const action = new MutableAction();

		action.id = idx;
		action.conditions = data.conditions.map((data: any) => new Condition(data));
		action.instructions = data.instructions.map((data: any) => new Instruction(data));
		action.zone = zone;

		return action;
	}

	_makeCharacter(data: any, idx: number): Char {
		const char = new MutableChar();
		char.id = idx;
		char.name = data.name;
		char.frames = [
			new CharFrame(data.frame1.tiles.map((i: number) => this.tiles[i])),
			new CharFrame(data.frame2.tiles.map((i: number) => this.tiles[i])),
			new CharFrame(data.frame3.tiles.map((i: number) => this.tiles[i]))
		];
		char.type = CharType.fromNumber(data.type);
		char.movementType = CharMovementType.fromNumber(data.movementType);
		char.garbage1 = data.probablyGarbage1;
		char.garbage2 = data.probablyGarbage2;

		return char;
	}

	private _makeNPC(data: any, idx: number) {
		const npc = new MutableNPC();
		npc.id = idx;
		npc.character = this._characters[data.character];
		npc.enabled = data.enabled;
		npc.position = new Point(data.x, data.y);
		npc.unknown1 = data.unknown1;
		npc.unknown2 = data.unknown2;
		npc.data = data.unknown3;

		return npc;
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
