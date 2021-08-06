import PuzzleType from "./puzzle-type";

class ZoneType {
	public static readonly None = new ZoneType();
	public static readonly Empty = new ZoneType();
	public static readonly BlockadeNorth = new ZoneType();
	public static readonly BlockadeSouth = new ZoneType();
	public static readonly BlockadeEast = new ZoneType();
	public static readonly BlockadeWest = new ZoneType();
	public static readonly UnknownIndyOnly = new ZoneType();
	public static readonly TravelStart = new ZoneType();
	public static readonly TravelEnd = new ZoneType();
	public static readonly Room = new ZoneType();
	public static readonly Load = new ZoneType();
	public static readonly Goal = new ZoneType();
	public static readonly Town = new ZoneType();
	public static readonly Win = new ZoneType();
	public static readonly Lose = new ZoneType();
	public static readonly Trade = new ZoneType();
	public static readonly Use = new ZoneType();
	public static readonly Find = new ZoneType();
	public static readonly FindUniqueWeapon = new ZoneType();

	public static readonly PlaceholderForEndPuzzle = new ZoneType();

	private static readonly knownTypes = [
		ZoneType.None,
		ZoneType.Empty,
		ZoneType.BlockadeNorth,
		ZoneType.BlockadeSouth,
		ZoneType.BlockadeEast,
		ZoneType.BlockadeWest,
		ZoneType.TravelStart,
		ZoneType.TravelEnd,
		ZoneType.Room,
		ZoneType.Load,
		ZoneType.Goal,
		ZoneType.Town,

		ZoneType.UnknownIndyOnly,

		ZoneType.Win,
		ZoneType.Lose,
		ZoneType.Trade,
		ZoneType.Use,
		ZoneType.Find,
		ZoneType.FindUniqueWeapon
	];

	get rawValue(): number {
		if (this === ZoneType.PlaceholderForEndPuzzle) return 9999;
		return ZoneType.knownTypes.indexOf(this);
	}

	get name(): string {
		switch (this) {
			case ZoneType.None:
				return "None";
			case ZoneType.Empty:
				return "Empty";
			case ZoneType.BlockadeNorth:
				return "Blockade North";
			case ZoneType.BlockadeSouth:
				return "Blockade South";
			case ZoneType.BlockadeEast:
				return "Blockade East";
			case ZoneType.BlockadeWest:
				return "Blockade West";
			case ZoneType.TravelStart:
				return "Travel Start";
			case ZoneType.TravelEnd:
				return "Travel End";
			case ZoneType.Room:
				return "Room";
			case ZoneType.Load:
				return "Load";
			case ZoneType.Goal:
				return "Goal";
			case ZoneType.Town:
				return "Town";
			case ZoneType.Win:
				return "Win";
			case ZoneType.Lose:
				return "Lose";
			case ZoneType.Trade:
				return "Trade";
			case ZoneType.Use:
				return "Use";
			case ZoneType.Find:
				return "Find";
			case ZoneType.FindUniqueWeapon:
				return "Find Unique Weapon";
			case ZoneType.UnknownIndyOnly:
				return "Unknown (indy)";

			default:
				return "Unknown";
		}
	}

	static isZoneType(number: number): boolean {
		return (number >= 0 && number < ZoneType.knownTypes.length) || number === 9999 || number === -1;
	}

	static fromNumber(number: number): ZoneType {
		if (!this.isZoneType(number)) throw RangeError(`Invalid zone type ${number} specified!`);
		if (number === 9999) return ZoneType.PlaceholderForEndPuzzle;
		if (number === -1) return ZoneType.None;

		return ZoneType.knownTypes[number];
	}

	public isBlockadeType(): boolean {
		switch (this) {
			case ZoneType.BlockadeNorth:
			case ZoneType.BlockadeEast:
			case ZoneType.BlockadeWest:
			case ZoneType.BlockadeSouth:
				return true;
			default:
				return false;
		}
	}

	public toPuzzleType(): PuzzleType {
		switch (this) {
			case ZoneType.Use:
				return PuzzleType.Use;
			case ZoneType.PlaceholderForEndPuzzle:
				return PuzzleType.End;
			case ZoneType.Goal:
				return PuzzleType.Goal;
			case ZoneType.Trade:
				return PuzzleType.Trade;
			default:
				throw `Zone type ${this} does not match any puzzle type!`;
		}
	}

	public toString(): string {
		return `ZoneType{${this.name.split(" ").join("")}}`;
	}
}

export default ZoneType;
