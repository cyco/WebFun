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
}

export default Sector;
