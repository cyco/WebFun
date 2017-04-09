export default class WorldItem {
	constructor() {
		this.zoneID = -1;
		this.zoneType = -1;

		this.puzzleIdx = -1;

		this.requiredItemID = -1;
		this.unknown606 = -1;
		this.npcID = -1;
		this.findItemID = -1;

		Object.seal(this);
	}
}