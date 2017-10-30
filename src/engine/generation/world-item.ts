import ZoneType from "../objects/zone-type";
import Zone from "src/engine/objects/zone";
import Tile from "src/engine/objects/tile";

class WorldItem {
	public zone: Zone = null;
	public zoneType: ZoneType = null;
	public puzzleIdx: number = -1;
	public requiredItem: Tile = null;
	public additionalRequiredItem: Tile = null;
	public puzzleIndex: number = -1;
	public npc: Tile = null;
	public findItem: Tile = null;
}

export default WorldItem;
