export default class WorldItem {
	constructor() {
		this.zoneID = -1;
		this.zoneType = -1;

		this.zoneTypeID = -1;
		this.puzzleIdx = -1;

		this.requiredItemID = -1;
		this.unknown606 = -1;
		this.npcID = -1;
		this.findItemID = -1;

		Object.seal(this);
	}
}

export const Type = {
	Invalid: -1,
	None: 0,
	Empty: 1,
	TravelStart: 101,
	TravelEnd: 102,
	Island: 104,
	Spaceport: 201,
	Candidate: 300,
	
	BlockWest: 301,
	BlockEast: 302,
	BlockNorth: 303,
	BlockSouth: 304,
	KeptFree: 305,

	Puzzle: 306,
};