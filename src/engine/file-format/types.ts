import { GameType } from "src/engine";

interface ActionItem {
	opcode: number;
	arguments: Int16Array;
	text: string;
}

interface Action {
	name?: string;
	conditions: ActionItem[];
	instructions: ActionItem[];
}

interface Zone {
	name?: string;
	actions: Action[];
	hotspots: Hotspot[];
	monsters: Monster[];
	planet: number;
	width: number;
	height: number;
	zoneType: number;
	tileIDs: Int16Array;
	requiredItemIDs: Int16Array;
	goalItemIDs: Int16Array;
	providedItemIDs: Int16Array;
	npcIDs: Int16Array;
	unknown: number;
}

interface Monster {
	character: number;
	x: number;
	y: number;
	loot: number;
	dropsLoot: boolean;
	waypoints: Int32Array;
}

interface Hotspot {
	type: number;
	x: number;
	y: number;
	enabled: boolean;
	argument: number;
}

interface Tile {
	name: string;
	attributes: number;
	pixels: Uint8Array;
}

interface Puzzle {
	name: string;
	type: number;
	unknown1: number;
	unknown2: number;
	unknown3: number;
	texts: string[];
	item1: number;
	item2: number;
}

type Sound = string;

interface Character {
	name: string;
	type: number;
	movementType: number;
	probablyGarbage1: number;
	probablyGarbage2: number;
	frame1: Int16Array;
	frame2: Int16Array;
	frame3: Int16Array;
	damage: number;
	health: number;
	reference: number;
}

interface Data {
	type: GameType;
	version: number;
	setup: Uint8Array;
	zones: Zone[];
	tiles: Tile[];
	puzzles: Puzzle[];
	sounds: Sound[];
	characters: Character[];
	end: number;
}

export { Monster, Hotspot, ActionItem, Action, Zone, Tile, Puzzle, Sound, Character, Data };
