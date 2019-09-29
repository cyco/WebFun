import { Action, Condition, Hotspot, Instruction, Sound, Puzzle, Char, Zone } from "../objects";
import {
	MutableAction,
	MutableChar,
	MutableNPC,
	MutablePuzzle,
	MutableTile,
	MutableZone
} from "src/engine/mutable-objects";
import { Point, Size } from "src/util";
import {
	NPC as RawNPC,
	Hotspot as RawHotspot,
	Action as RawAction,
	Zone as RawZone,
	Tile as RawTile,
	Puzzle as RawPuzzle,
	Character as RawCharacter,
	Data as RawData
} from "../file-format/types";

import { Planet } from "../types";
import { Yoda } from "src/engine/type";
import GameData from "./index";

const makeTile = (t: RawTile, idx: number) => {
	const tile = new MutableTile();
	tile.id = idx;
	tile.attributes = t.attributes;
	tile.imageData = t.pixels;
	tile.name = t.name;

	return tile;
};

const makeCharacter = (raw: RawCharacter, idx: number, data: GameData) => {
	const char = new MutableChar();
	char.id = idx;
	char.name = raw.name;
	char.frames = [
		new Char.Frame(Array.from(raw.frame1).map((i: number) => data.tiles[i] || null)),
		new Char.Frame(Array.from(raw.frame2).map((i: number) => data.tiles[i] || null)),
		new Char.Frame(Array.from(raw.frame3).map((i: number) => data.tiles[i] || null))
	];
	char.type = Char.Type.fromNumber(raw.type);
	char.movementType = Char.MovementType.fromNumber(raw.movementType);
	char.garbage1 = raw.probablyGarbage1;
	char.garbage2 = raw.probablyGarbage2;

	char.damage = raw.damage;
	char.health = raw.health;
	char.reference = raw.reference;

	return char;
};

const makePuzzle = (raw: RawPuzzle, idx: number, data: GameData) => {
	const puzzle = new MutablePuzzle();

	puzzle.id = idx;
	puzzle.name = raw.name || "";
	puzzle.type = Puzzle.Type.fromNumber(raw.type);
	puzzle.unknown1 = raw.unknown1;
	puzzle.unknown2 = raw.unknown2;
	puzzle.unknown3 = raw.unknown3;

	puzzle.strings = raw.texts.slice();
	puzzle.item1 = data.tiles[raw.item1] || null;
	puzzle.item2 = data.tiles[raw.item2] || null;

	if (puzzle.type !== Puzzle.Type.End && puzzle.type !== Puzzle.Type.Disabled) {
		puzzle.item2 = null;
	}

	if (data.type === Yoda && (idx === Yoda.goalIDs.RESCUE_YODA || idx === Yoda.goalIDs.CAR)) {
		puzzle.type = Puzzle.Type.Disabled;
	}

	return puzzle;
};

const makeHotspot = (raw: RawHotspot, idx: number, _: any): Hotspot => {
	const hotspot = new Hotspot();
	hotspot.id = idx;
	hotspot.x = raw.x;
	hotspot.y = raw.y;

	hotspot.enabled = !!raw.enabled;
	hotspot.arg = raw.argument;
	hotspot.type = Hotspot.Type.fromNumber(raw.type);

	switch (hotspot.type) {
		case Hotspot.Type.DropQuestItem:
		case Hotspot.Type.SpawnLocation:
		case Hotspot.Type.DropUniqueWeapon:
		case Hotspot.Type.DropMap:
			hotspot.enabled = false;
			break;
		case Hotspot.Type.VehicleTo:
		case Hotspot.Type.VehicleBack:
		case Hotspot.Type.DoorIn:
		case Hotspot.Type.Lock:
		case Hotspot.Type.xWingFromDagobah:
		case Hotspot.Type.xWingToDagobah:
		case Hotspot.Type.DropItem:
		case Hotspot.Type.PuzzleNPC:
		case Hotspot.Type.DropWeapon:
			hotspot.enabled = true;
			break;
		default:
			hotspot.arg = -1;
			hotspot.enabled = true;
			break;
	}

	return hotspot;
};

const makeAction = (raw: RawAction, idx: number, zone: Zone, _: any): Action => {
	const action = new MutableAction();

	action.id = idx;
	action.name = raw.name || "";
	action.conditions = raw.conditions.map((raw: any) => new Condition(raw));
	action.instructions = raw.instructions.map((raw: any) => new Instruction(raw));
	action.zone = zone;

	return action;
};

const makeNPC = (raw: RawNPC, idx: number, data: GameData) => {
	const npc = new MutableNPC();
	npc.id = idx;
	npc.face = data.characters[raw.character];
	npc.position = new Point(raw.x, raw.y, Zone.Layer.Object);
	npc.loot = raw.loot;
	npc.dropsLoot = raw.dropsLoot;
	npc.waypoints = [];

	const path = Array.from(raw.waypoints);
	if (path.some(i => i !== -1)) {
		npc.waypoints = [
			new Point(path[0], path[1]),
			new Point(path[2], path[3]),
			new Point(path[4], path[5]),
			new Point(path[6], path[7])
		];
	}

	return npc;
};

const makeZone = (raw: RawZone, idx: number, data: GameData) => {
	const zone = new MutableZone();

	zone.id = idx;
	zone.name = raw.name || "";
	zone.planet = Planet.fromNumber(raw.planet);
	zone.size = new Size(raw.width, raw.height);
	zone.type = Zone.Type.fromNumber(raw.zoneType);
	zone.tileIDs = raw.tileIDs.slice();
	zone.hotspots = raw.hotspots.map((d: any, idx: number) => makeHotspot(d, idx, data));
	zone.npcs = raw.npcs.map((d: any, idx: number) => makeNPC(d, idx, data));
	zone.goalItems = Array.from(raw.goalItemIDs).map((id: number) => data.tiles[id]);
	zone.requiredItems = Array.from(raw.requiredItemIDs).map((id: number) => data.tiles[id]);
	zone.providedItems = Array.from(raw.providedItemIDs).map((id: number) => data.tiles[id]);
	zone.puzzleNPCs = Array.from(raw.puzzleNPCIDs).map((id: number) => data.tiles[id]);
	zone.izaxUnknown = raw.unknown;
	zone.izx4Unknown = raw.unknown;

	zone.actions = raw.actions.map((raw: any, i: number) => makeAction(raw, i, zone, data));
	zone.tileStore = data.tiles;

	return zone;
};

export default (data: any, raw: RawData) => {
	data._rawInput = raw;
	data._type = raw.type;
	data._version = raw.version;
	data._setup = raw.setup;
	data._sounds = raw.sounds.map((name: string, id: number) => new Sound(id, name));
	data._tiles = raw.tiles.map(makeTile);
	data._characters = raw.characters.map((r: any, i: number) => makeCharacter(r, i, data));
	data._puzzles = raw.puzzles.map((r: any, i: number) => makePuzzle(r, i, data));
	data._zones = raw.zones.map((r: any, i: number) => makeZone(r, i, data));
	data.zones.forEach((z: Zone, _: number, store: Zone[]) => ((z as any).zoneStore = store));
};
