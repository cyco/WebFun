export default class WorldItem {
	constructor() {
		this.zoneId = -1;
		this.zoneType = 0;

		this.puzzleIdx = -1;

		this.requiredItemID = -1;
		this.unknown606 = -1;
		this.npcID = -1;
		this.findItemID = -1;

		Object.seal(this);
	}
}