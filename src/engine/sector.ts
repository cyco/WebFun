import { Tile, Zone } from "src/engine/objects";
import AssetManager from "./asset-manager";

class Sector {
	public isGoal: number = -1;
	public findItem: Tile = null;
	public npc: Tile = null;
	public additionalRequiredItem: Tile = null;
	public additionalGainItem: Tile = null;
	public requiredItem: Tile = null;
	public puzzleIndex: number = -1;
	public visited: boolean = false;
	public solved1: boolean = false;
	public solved2: boolean = false;
	public solved3: boolean = false;
	public solved4: boolean = false;
	public zone: Zone = null;
	public zoneType: Zone.Type = null;
	public usedAlternateStrain: boolean;

	public containsZone(zone: Zone, assets: AssetManager): boolean {
		if (!this.zone) return false;
		if (zone === this.zone) return true;

		return this.zone.leadsTo(zone, assets);
	}

	public get solved(): boolean {
		if (!this.zone) return false;

		switch (this.zone.type) {
			case Zone.Type.Empty:
				return false;
			case Zone.Type.Town:
				return false;
			case Zone.Type.BlockadeNorth:
			case Zone.Type.BlockadeSouth:
			case Zone.Type.BlockadeEast:
			case Zone.Type.BlockadeWest:
			case Zone.Type.TravelStart:
			case Zone.Type.TravelEnd:
				return this.solved1;
			case Zone.Type.Goal:
				return this.solved1 && this.solved2;
			case Zone.Type.Find:
			case Zone.Type.FindUniqueWeapon:
				return this.solved1;
			case Zone.Type.Trade:
				return this.solved2;
			case Zone.Type.Use:
				return this.solved2;
			case Zone.Type.Load:
			case Zone.Type.Room:
			case Zone.Type.Win:
			case Zone.Type.Lose:
			case Zone.Type.None:
			default:
				return false;
		}
	}
}

export default Sector;
