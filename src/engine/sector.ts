import { Tile, Zone } from "src/engine/objects";
import AssetManager from "./asset-manager";

class Sector {
	public additionalRequiredItem: Tile = null;
	public field16: number = -1;
	public fieldC: number = -1;
	public fieldEA: number = -1;
	public findItem: Tile = null;
	public npc: Tile = null;
	public puzzleIndex: number = -1;
	public requiredItem: Tile = null;
	public solved1: boolean = false;
	public solved2: boolean = false;
	public solved3: boolean = false;
	public solved4: boolean = false;
	public visited: boolean = false;
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
