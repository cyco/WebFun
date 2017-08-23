export default class WorldItem {
	constructor() {
		this.zoneID = -1;
		this.zoneType = 0;

		this.puzzleIdx = -1;

		this.requiredItemID = -1;
		this.additionalRequiredItemID = -1;
		this.puzzleIndex = -1; // this one's wrongly set to non 0 when a tool is required
		this.npcID = -1;
		this.findItemID = -1;

		Object.seal(this);
	}
}
