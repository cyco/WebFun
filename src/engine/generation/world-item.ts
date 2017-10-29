import ZoneType from "../objects/zone-type";
import Zone from "src/engine/objects/zone";
import Tile from "src/engine/objects/tile";

class WorldItem {
	public zoneID: Zone = null;
	public zoneType: ZoneType = null;
	public puzzleIdx: number = -1;
	public requiredItemID: Tile = null;
	public additionalRequiredItemID: Tile = null;
	public puzzleIndex: number = -1;
	public npcID: Tile = null;
	public findItemID: Tile = null;
}

export default WorldItem;
