import { Tile, Zone } from "src/engine/objects";

class WorldItem {
	public zone: Zone = null;
	public zoneType: Zone.Type = null;
	public puzzleIndex: number = -1;
	public requiredItem: Tile = null;
	public additionalRequiredItem: Tile = null;
	public npc: Tile = null;
	public findItem: Tile = null;
}

export default WorldItem;
