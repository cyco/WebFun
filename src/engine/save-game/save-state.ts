import Variant from "../variant";
import { Point } from "src/util";
import { Zone } from "src/engine/objects";

export type SavedZone = {
	id: number;
	counter: number;
	sectorCounter: number;
	doorInLocation: Point;
	visited: boolean;
	random: number;
	tileIDs: Int16Array;
	hotspots: SavedHotspot[];
	actions: SavedAction[];
	monsters: SavedMonster[];
};

export type SavedMonster = {
	face: number;
	enabled: boolean;
	position: Point;
	damageTaken: number;
	loot: number;
	field10: number;
	bulletX: number;
	bulletY: number;
	currentFrame: number;
	facingDirection: number;
	cooldown: number;
	flag18: boolean;
	flag20: boolean;
	flag1c: boolean;
	directionX: number;
	directionY: number;
	bulletOffset: number;
	field60: number;
	flag2c: boolean;
	flag34: boolean;
	hasItem: boolean;
	preferredDirection: number;
	waypoints: Point[];
};

export type SavedHotspot = {
	type: number;
	enabled: boolean;
	argument: number;
	x: number;
	y: number;
};

export type SavedSector = {
	visited: boolean;
	solved1: boolean;
	solved2: boolean;
	solved3: boolean;
	solved4: boolean;
	zone: number;
	puzzleIndex: number;
	requiredItem: number;
	findItem: number;
	isGoal: boolean;
	additionalRequiredItem: number;
	additionalGainItem: number;
	usedAlternateStrain: boolean;
	npc: number;
	unknown: number;
};

export type SavedAction = boolean;

export type SavedWorld = { sectors: SavedSector[] };

class SaveState {
	public type: Variant;
	public seed: number;
	public planet: Zone.Planet;
	public puzzleIDs1: Int16Array;
	public puzzleIDs2: Int16Array;
	public goalPuzzle: number;

	public dagobah: SavedWorld;
	public world: SavedWorld;

	public onDagobah: boolean;
	public positionOnWorld: Point;
	public currentZoneID: number;
	public positionOnZone: Point;

	public damageTaken: number;
	public livesLost: number;

	public inventoryIDs: Int16Array;

	public currentWeapon: number;
	public currentAmmo: number;

	public forceAmmo: number;
	public blasterAmmo: number;
	public blasterRifleAmmo: number;

	public difficulty: number;
	public timeElapsed: number;
	public worldSize: number; // in puzzles (?)

	public unknownCount: number;
	public unknownSum: number;
}

export default SaveState;
