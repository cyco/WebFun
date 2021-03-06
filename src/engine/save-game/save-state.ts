import Variant from "../variant";
import { Point } from "src/util";
import World from "src/engine/world";
import { Zone } from "src/engine/objects";

class SaveState {
	public type: Variant;
	public seed: number;
	public planet: Zone.Planet;
	public puzzleIDs1: Int16Array;
	public puzzleIDs2: Int16Array;
	public goalPuzzle: number;

	public dagobah: World;
	public world: World;

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
