import {
	MutableNPC,
	MutableAction,
	MutableChar,
	MutablePuzzle,
	MutableTile,
	MutableZone
} from "src/engine/mutable-objects";
import CharType from "src/engine/objects/char-type";

import {
	Action,
	CharFrame,
	CharMovementType,
	Condition,
	Hotspot,
	HotspotType,
	Instruction,
	PuzzleType,
	Zone,
	ZoneType,
	Sound
} from "../objects";

import { Planet } from "../types";
import { Size, Point } from "src/util";
import { Yoda } from "src/engine/type";

const makeTile = (t: any, idx: number) => {
	const tile = new MutableTile();
	tile.id = idx;
	tile.attributes = t.attributes;
	tile.imageData = t.imageData || t.pixels;
	tile.name = t.name;

	return tile;
};

const makeCharacter = (raw: any, idx: number, data: any) => {
	const char = new MutableChar();
	char.id = idx;
	char.name = raw.name;
	char.frames = [
		new CharFrame(Array.from(raw.frame1).map((i: number) => data._tiles[i] || null)),
		new CharFrame(Array.from(raw.frame2).map((i: number) => data._tiles[i] || null)),
		new CharFrame(Array.from(raw.frame3).map((i: number) => data._tiles[i] || null))
	];
	char.type = CharType.fromNumber(raw.type);
	char.movementType = CharMovementType.fromNumber(raw.movementType);
	char.garbage1 = raw.probablyGarbage1;
	char.garbage2 = raw.probablyGarbage2;

	char.damage = raw.damage;
	char.health = raw.health;
	char.reference = raw.reference;

	return char;
};

const makePuzzle = (raw: any, idx: number, data: any) => {
	const puzzle = new MutablePuzzle();

	puzzle.id = idx;
	puzzle.name = raw.name || "";
	puzzle.type = PuzzleType.fromNumber(raw.type);
	puzzle.unknown1 = raw.unknown1;
	puzzle.unknown2 = raw.unknown2;
	puzzle.unknown3 = raw.unknown3;

	puzzle.strings = raw.texts.slice();
	puzzle.item1 = data._tiles[raw.item1] || null;
	puzzle.item2 = data._tiles[raw.item2] || null;

	if (puzzle.type !== PuzzleType.End && puzzle.type !== PuzzleType.Disabled) {
		puzzle.item2 = null;
	}

	if (data._type === Yoda && (idx === 0xbd || idx === 0xc5)) puzzle.type = PuzzleType.Disabled;

	return puzzle;
};

const makeHotspot = (raw: any, _: any): Hotspot => {
	const hotspot = new Hotspot();
	hotspot.x = raw.x;
	hotspot.y = raw.y;

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
};

const makeAction = (raw: any, idx: number, zone: Zone, _: any): Action => {
	const action = new MutableAction();

	action.id = idx;
	action.name = raw.name || "";
	action.conditions = raw.conditions.map((raw: any) => new Condition(raw));
	action.instructions = raw.instructions.map((raw: any) => new Instruction(raw));
	action.zone = zone;

	return action;
};

const makeNPC = (raw: any, idx: number, data: any) => {
	const npc = new MutableNPC();
	npc.id = idx;
	npc.character = data._characters[raw.character];
	npc.enabled = raw.enabled;
	npc.position = new Point(raw.x, raw.y);

	return npc;
};

const makeZone = (raw: any, idx: number, data: any) => {
	const zone = new MutableZone();

	zone.id = idx;
	zone.name = raw.name || "";
	zone.planet = Planet.fromNumber(raw.planet);
	zone.size = new Size(raw.width, raw.height);
	zone.type = ZoneType.fromNumber(raw.zoneType);
	zone.tileIDs = raw.tileIDs;
	zone.hotspots = raw.hotspots.map((d: any) => makeHotspot(d, data));
	zone.npcs = raw.npcs.map((d: any, idx: number) => makeNPC(d, idx, data));
	zone.goalItems = Array.from(raw.goalItemIDs).map((id: number) => data._tiles[id]);
	zone.requiredItems = Array.from(raw.requiredItemIDs).map((id: number) => data._tiles[id]);
	zone.providedItems = Array.from(raw.providedItemIDs).map((id: number) => data._tiles[id]);
	zone.puzzleNPCs = Array.from(raw.puzzleNPCIDs).map((id: number) => data._tiles[id]);
	zone.izaxUnknown = raw.unknown;
	zone.izx4Unknown = raw.unknown;

	zone.actions = raw.actions.map((raw: any, i: number) => makeAction(raw, i, zone, data));
	zone.tileStore = data.tiles;

	return zone;
};

export default (data: any, raw: any) => {
	data._type = raw.type;
	data._rawInput = raw;
	data._version = raw.version;
	data._setup = raw.setup;
	data._sounds = raw.sounds.map((name: string, id: number) => new Sound(id, name));
	data._tiles = raw.tiles.map(makeTile);
	data._characters = raw.characters.map((r: any, i: number) => makeCharacter(r, i, data));
	data._puzzles = raw.puzzles.map((r: any, i: number) => makePuzzle(r, i, data));
	data._zones = raw.zones.map((r: any, i: number) => makeZone(r, i, data));
	data._zones.forEach((z: Zone, _: number, store: Zone[]) => ((z as any).zoneStore = store));
};
