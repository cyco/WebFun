import { Point } from "../../util";
import { Planet, WorldSize } from "../types";
import World from "./world";
import { GameType } from "../type";

class SaveState {
	public type: GameType;
	public seed: number;
	public planet: Planet;
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
	public worldSize: WorldSize;

	public unknownCount: number;
	public unknownSum: number;
	public unknownThing: number;
}

export default SaveState;
