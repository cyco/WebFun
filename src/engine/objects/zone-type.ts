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

	public static readonly Unknown = new ZoneType(); //: 9999

	private static readonly knownZoneTypes = [
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
		ZoneType.Win,
		ZoneType.Lose,
		ZoneType.Trade,
		ZoneType.Use,
		ZoneType.Find,
		ZoneType.FindTheForce,

		ZoneType.Unknown
	];

	static isZoneType(number: number): boolean {
		return number > 0 && number < ZoneType.knownZoneTypes.length || number === 99;
	}

	static fromNumber(number: number): ZoneType {
		if (!this.isZoneType(number)) throw RangeError(`Invalid planet ${number} requested!`);
		if (number === 99) return ZoneType.Unknown;
		return ZoneType.knownZoneTypes[number];
	}

	get rawValue(): number {
		return ZoneType.knownZoneTypes.indexOf(this);
	}

	public toString() {
		return `ZoneType {${(() => {
			switch (this) {
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
				case ZoneType.Unknown: /* intentional fallthrough */
				default: return 'Unknown';
			}
		})()}}`;
	}
}

export default ZoneType;
