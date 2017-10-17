import PuzzleType from "./puzzle-type";

class ZoneType {
	public static readonly None = new ZoneType();
	public static readonly Empty = new ZoneType();
	public static readonly BlockadeNorth = new ZoneType();
	public static readonly BlockadeSouth = new ZoneType();
	public static readonly BlockadeEast = new ZoneType();
	public static readonly BlockadeWest = new ZoneType();
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
	public static readonly FindTheForce = new ZoneType();

	public static readonly Unknown = new ZoneType();

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

		undefined,

		ZoneType.Win,
		ZoneType.Lose,
		ZoneType.Trade,
		ZoneType.Use,
		ZoneType.Find,
		ZoneType.FindTheForce
	];

	static isZoneType(number: number): boolean {
		return number >= 0 && number < ZoneType.knownTypes.length || number === 9999;
	}

	static fromNumber(number: number): ZoneType {
		if (!this.isZoneType(number)) throw RangeError(`Invalid zone type ${number} specified!`);
		if (number === 9999) return ZoneType.Unknown;

		return ZoneType.knownTypes[number];
	}

	get rawValue(): number {
		if (this === ZoneType.Unknown) return 9999;
		return ZoneType.knownTypes.indexOf(this);
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
				return PuzzleType.U1;
			case ZoneType.Unknown:
				return PuzzleType.End;
			case ZoneType.Goal:
				return PuzzleType.U3;
			case ZoneType.Trade:
				return PuzzleType.U2;
			default:
				throw `Zone type ${this} does not match any puzzle type!`;
		}
	};

	public toString(): string {
		return `ZoneType{${this.name}}`;
	}

	private get name(){
		switch(this) {
			case ZoneType.None: return 'None';
			case ZoneType.Empty: return 'Empty';
			case ZoneType.BlockadeNorth: return 'BlockadeNorth';
			case ZoneType.BlockadeSouth: return 'BlockadeSouth';
			case ZoneType.BlockadeEast: return 'BlockadeEast';
			case ZoneType.BlockadeWest: return 'BlockadeWest';
			case ZoneType.TravelStart: return 'TravelStart';
			case ZoneType.TravelEnd: return 'TravelEnd';
			case ZoneType.Room: return 'Room';
			case ZoneType.Load: return 'Load';
			case ZoneType.Goal: return 'Goal';
			case ZoneType.Town: return 'Town';
			case ZoneType.Win: return 'Win';
			case ZoneType.Lose: return 'Lose';
			case ZoneType.Trade: return 'Trade';
			case ZoneType.Use: return 'Use';
			case ZoneType.Find: return 'Find';
			case ZoneType.FindTheForce: return 'FindTheForce';

			default: return 'Unknown';
		}
	}
}

export default ZoneType;
