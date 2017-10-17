import ZoneType from "../objects/zone-type";

class WorldItem {
	public zoneID: number = -1;
	public zoneType: ZoneType = null;
	public puzzleIdx: number = -1;
	public requiredItemID: number = -1;
	public additionalRequiredItemID: number = -1;
	public puzzleIndex: number = -1;
	public npcID: number = -1;
	public findItemID: number = -1;
}

export default WorldItem;
