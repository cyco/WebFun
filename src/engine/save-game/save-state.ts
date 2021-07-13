import Variant from "../variant";
import { Point } from "src/util";
import { Zone } from "src/engine/objects";

export type SavedZone = {
	id: number;
	planet: number;
	visited: boolean;
	counter: number;
	sectorCounter: number;
	random: number;
	doorInLocation: Point;
	tileIDs: Int16Array;
};

export type SavedMonster = {
	face: number;
	enabled?: boolean;
	position: Point;
	damageTaken: number;
	loot?: number;
	field10?: number;
	bulletX?: number;
	bulletY?: number;
	currentFrame?: number;
	facingDirection?: number;
	cooldown?: number;
	flag18?: boolean;
	flag20?: boolean;
	flag1c?: boolean;
	directionX?: number;
	directionY?: number;
	bulletOffset?: number;
	field60?: number;
	flag2c?: boolean;
	flag34?: boolean;
	hasItem?: boolean;
	preferredDirection?: number;
	waypoints?: Point[];
};

export type SavedHotspot = {
	enabled: boolean;
	argument: number;
	x?: number;
	y?: number;
	type?: number;
};

export type SavedSector = {
	visited: boolean;
	solved1: boolean;
	solved2: boolean;
	solved3?: boolean;
	solved4?: boolean;
	zone: number;
	puzzleIndex: number;
	requiredItem: number;
	findItem: number;
	isGoal?: boolean;
	additionalRequiredItem?: number;
	additionalGainItem?: number;
	usedAlternateStrain?: boolean;
	npc: number;
	unknown?: number;
};

export type SavedAction = boolean;

export type SavedWorld = { sectors: SavedSector[] };

class SaveState {
	public type: Variant;
	public seed: number;
	public planet: Zone.Planet;
	public puzzleIDs1: number[];
	public puzzleIDs2: number[];
	public goalPuzzle: number;

	public dagobah: SavedWorld;
	public world: SavedWorld;

	public zones: Map<number, SavedZone>;
	public hotspots: Map<number, SavedHotspot[]>;
	public actions: Map<number, SavedAction[]>;
	public monsters: Map<number, SavedMonster[]>;

	public onDagobah: boolean;
	public positionOnWorld: Point;
	public currentZoneID: number;
	public positionOnZone: Point;

	public damageTaken: number;
	public livesLost: number;

	public inventoryIDs: number[];

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
