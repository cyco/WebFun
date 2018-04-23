import GameData from "./index";
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
} from "../objects";

import {
	MutableNPC,
	MutableAction,
	MutableChar,
	MutablePuzzle,
	MutableTile,
	MutableZone
} from "src/engine/mutable-objects";

import { Planet } from "../types";
import { Size, Point } from "src/util";
import CharType from "src/engine/objects/char-type";

declare interface RawGameData {
	catalog: any[];
}

function _getCategory(category: string, data: any) {
	const catalogEntry = data._rawInput.catalog.find((c: any) => c.type === category);
	if (!catalogEntry) throw `Category ${category} not found in game file!`;

	return catalogEntry.content;
}

function _makePuzzle(raw: any, index: number, data: any): Puzzle {
	const puzzle = new MutablePuzzle();

	puzzle.id = index;
	puzzle.type = PuzzleType.fromNumber(raw.type);
	puzzle.unknown1 = raw.unknown1;
	puzzle.unknown2 = raw.unknown2;
	puzzle.unknown3 = raw.unknown3;

	puzzle.strings = raw.strings.map((s: { content: string }) => s.content);
	puzzle.item1 = data._tiles[raw.item1] ? data._tiles[raw.item1] : null;
	puzzle.item2 = data._tiles[raw.item2] ? data._tiles[raw.item2] : null;

	if (puzzle.type !== PuzzleType.End && puzzle.type !== PuzzleType.Disabled) {
		puzzle.item2 = null;
	}

	if (index === 0xbd || index === 0xc5) puzzle.type = PuzzleType.Disabled;

	return puzzle;
}

function _makeZone(raw: any, data: any): Zone {
	const zone = new MutableZone();

	zone.id = raw.index;
	zone.planet = Planet.fromNumber(raw.planet);
	zone.size = new Size(raw.width, raw.height);
	zone.type = ZoneType.fromNumber(raw.type);
	zone.tileIDs = raw.tileIds;
	zone.hotspots = raw.hotspots.map((d: any) => _makeHotspot(d, data));
	zone.npcs = raw.izax.npcs.map((d: any, idx: number) => _makeNPC(d, idx, data));
	zone.goalItems = raw.izax.goalItems.map((id: number) => data._tiles[id]);
	zone.requiredItems = raw.izax.requiredItems.map((id: number) => data._tiles[id]);
	zone.providedItems = raw.izx2.providedItems.map((id: number) => data._tiles[id]);
	zone.puzzleNPCs = raw.izx3.puzzleNpc.map((id: number) => data._tiles[id]);
	zone.izaxUnknown = raw.izax.unknownCount;
	zone.izx4Unknown = raw.izx4.unknown;

	zone.actions = raw.actions.map((raw: any, i: number) => _makeAction(raw, i, zone, data));
	zone.tileStore = data.tiles;
	zone.zoneStore = data.zones;

	return zone;
}

function _makeHotspot(raw: any, data: any): Hotspot {
	const hotspot = new Hotspot();
	hotspot._x = raw.x;
	hotspot._y = raw.y;

	hotspot.enabled = !!raw.enabled;
	hotspot.arg = raw.argument;
	hotspot.type = HotspotType.fromNumber(raw.type);

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

function _makeAction(raw: any, idx: number, zone: Zone, data: any): Action {
	const action = new MutableAction();

	action.id = idx;
	action.conditions = raw.conditions.map((raw: any) => new Condition(raw));
	action.instructions = raw.instructions.map((raw: any) => new Instruction(raw));
	action.zone = zone;

	return action;
}

function _makeCharacter(raw: any, idx: number, data: any): Char {
	const char = new MutableChar();
	char.id = idx;
	char.name = raw.name;
	char.frames = [
		new CharFrame(raw.frame1.tiles.map((i: number) => data.tiles[i])),
		new CharFrame(raw.frame2.tiles.map((i: number) => data.tiles[i])),
		new CharFrame(raw.frame3.tiles.map((i: number) => data.tiles[i]))
	];
	char.type = CharType.fromNumber(raw.type);
	char.movementType = CharMovementType.fromNumber(raw.movementType);
	char.garbage1 = raw.probablyGarbage1;
	char.garbage2 = raw.probablyGarbage2;

	return char;
}

function _makeNPC(raw: any, idx: number, data: any) {
	const npc = new MutableNPC();
	npc.id = idx;
	npc.character = data._characters[raw.character];
	npc.enabled = raw.enabled;
	npc.position = new Point(raw.x, raw.y);

	return npc;
}

export default (data: any, raw: any) => {
	data._rawInput = raw;
	data._version = _getCategory("VERS", data).version;
	data._sounds = _getCategory("SNDS", data).sounds.map((i: { content: string }) => i.content);
	data._tiles = _getCategory("TILE", data).tiles.map(
		(t: { attributes: number; pixels: Uint8Array }, i: number) => {
			const tile = new MutableTile();
			tile.id = i;
			tile.attributes = t.attributes;
			tile.imageData = t.pixels;
			return tile;
		}
	);
	data._puzzles = _getCategory("PUZ2", data)
		.puzzles.filter(({ index }: { index: number }) => index !== -1)
		.map((raw: any, index: number) => _makePuzzle(raw, index, data));
	data._characters = _getCategory("CHAR", data)
		.characters.filter(({ index }: { index: number }) => index !== -1)
		.map((raw: any, index: number) => _makeCharacter(raw, index, data));

	data._zones = [];
	_getCategory("ZONE", data)
		.zones.map((raw: any) => _makeZone(raw, data))
		.forEach((z: Zone) => data._zones.push(z));

	_getCategory("CAUX", data)
		.auxiliaries.filter(({ index }: { index: number }) => index !== -1)
		.forEach(({ damage }: { damage: number }, idx: number) => {
			const char = <MutableChar>data._characters[idx];
			char.damage = damage;
		});

	_getCategory("CHWP", data)
		.weapons.filter(({ index }: { index: number }) => index !== -1)
		.forEach(({ reference, health }: { reference: number; health: number }, idx: number) => {
			const char = <MutableChar>data._characters[idx];
			char.reference = reference;
			char.health = health;
		});
	_getCategory("TNAM", data)
		.names.filter(({ tileId }: { tileId: number }) => tileId !== -1)
		.forEach((nameSpecification: any) => {
			if (!nameSpecification.name) return;

			const tile = <MutableTile>data._tiles[nameSpecification.tileId];
			tile.name = nameSpecification.name;
		});
	data._setup = _getCategory("STUP", data).pixels;
};
