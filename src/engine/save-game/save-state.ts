import { Planet, WorldSize } from "../types";
import World from "./world";
import { Point } from "../../util";

class SaveState {
	seed: number;
	planet: Planet;
	puzzleIDs1: Int16Array;
	puzzleIDs2: Int16Array;
	goalPuzzle: number;

	dagobah: World;
	world: World;

	onDagobah: boolean;
	positionOnWorld: Point;
	currentZoneID: number;
	positionOnZone: Point;

	damageTaken: number;
	livesLeft: number;

	inventoryIDs: Int16Array;

	currentWeapon: number;
	currentAmmo: number;

	forceAmmo: number;
	blasterAmmo: number;
	blasterRifleAmmo: number;

	difficulty: number;
	timeElapsed: number;
	worldSize: WorldSize;

	unknownCount: number;
	unknownSum: number;
	unknownThing: number;
}

export default SaveState;
