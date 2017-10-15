import { ZoneType } from "../objects";

class WorldItemType {
	public static readonly Invalid = new WorldItemType();
	public static readonly None = new WorldItemType();
	public static readonly Empty = new WorldItemType();
	public static readonly TravelStart = new WorldItemType();
	public static readonly TravelEnd = new WorldItemType();
	public static readonly Island = new WorldItemType();
	public static readonly Spaceport = new WorldItemType();
	public static readonly Candidate = new WorldItemType();
	public static readonly BlockWest = new WorldItemType();
	public static readonly BlockEast= new WorldItemType();
	public static readonly BlockNorth = new WorldItemType();
	public static readonly BlockSouth = new WorldItemType();
	public static readonly KeptFree = new WorldItemType();
	public static readonly Puzzle = new WorldItemType();

	public static isWorldItemType(number: number): boolean {
		switch (number) {
			case -1:
			case 0:
			case 1:
			case 101:
			case 102:
			case 104:
			case 201:
			case 300:
			case 301:
			case 302:
			case 303:
			case 304:
			case 305:
			case 306:
				return true;
			default:
				return false;
		}
	}

	public static fromNumber(number: number): WorldItemType {
		if(!WorldItemType.isWorldItemType(number)) throw new RangeError(`Value ${number} does not specify a world item type`);
		switch (number) {
			case -1: return WorldItemType.Invalid;
			case 0: return WorldItemType.None;
			case 1: return WorldItemType.Empty;
			case 101: return WorldItemType.TravelStart;
			case 102: return WorldItemType.TravelEnd;
			case 104: return WorldItemType.Island;
			case 201: return WorldItemType.Spaceport;
			case 300: return WorldItemType.Candidate;
			case 301: return WorldItemType.BlockEast;
			case 302: return WorldItemType.BlockWest;
			case 303: return WorldItemType.BlockNorth;
			case 304: return WorldItemType.BlockSouth;
			case 305: return WorldItemType.KeptFree;
			case 306: return WorldItemType.Puzzle;
		}
	}


	public toZoneType() {
		switch (this) {
			case WorldItemType.Spaceport:
				return ZoneType.Town;
			case WorldItemType.BlockEast:
				return ZoneType.BlockadeEast;
			case WorldItemType.BlockWest:
				return ZoneType.BlockadeWest;
			case WorldItemType.BlockNorth:
				return ZoneType.BlockadeNorth;
			case WorldItemType.BlockSouth:
				return ZoneType.BlockadeSouth;
			default:
				return ZoneType.Empty;
		}
	};

	public get rawValue(){
		switch (this) {
			case WorldItemType.Invalid: return -1;
			case WorldItemType.None: return 0;
			case WorldItemType.Empty: return 1;
			case WorldItemType.TravelStart: return 101;
			case WorldItemType.TravelEnd: return 102;
			case WorldItemType.Island: return 104;
			case WorldItemType.Spaceport: return 201;
			case WorldItemType.Candidate: return 300;
			case WorldItemType.BlockEast: return 301;
			case WorldItemType.BlockWest: return 302;
			case WorldItemType.BlockNorth: return 303;
			case WorldItemType.BlockSouth: return 304;
			case WorldItemType.KeptFree: return 305;
			case WorldItemType.Puzzle: return 306;
			default: return null;
		}
	}

	public toString(){
		return `WorldItemType {}`;
	}
}

export default WorldItemType;
