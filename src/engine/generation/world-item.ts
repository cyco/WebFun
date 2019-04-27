import Tile from "src/engine/objects/tile";
import Zone from "src/engine/objects/zone";
import ZoneType from "../objects/zone-type";

class WorldItem {
	public zone: Zone = null;
	public zoneType: ZoneType = null;
	public puzzleIndex: number = -1;
	public requiredItem: Tile = null;
	public additionalRequiredItem: Tile = null;
	public npc: Tile = null;
	public findItem: Tile = null;
}

export default WorldItem;
