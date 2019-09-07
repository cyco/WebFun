import { Tile, Zone } from "src/engine/objects";

class Sector {
	public zone: Zone = null;
	public zoneType: Zone.Type = null;
	public puzzleIndex: number = -1;
	public npc: Tile = null;
	public findItem: Tile = null;
	public requiredItem: Tile = null;
	public additionalRequiredItem: Tile = null;
}

export default Sector;
