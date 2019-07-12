class CharMovementType {
	public static readonly None = new CharMovementType();
	public static readonly Unspecific1 = new CharMovementType();
	public static readonly Unspecific2 = new CharMovementType();
	public static readonly Unspecific3 = new CharMovementType();
	public static readonly Sit = new CharMovementType();
	public static readonly Unspecific4 = new CharMovementType();
	public static readonly Unspecific5 = new CharMovementType();
	public static readonly Droid = new CharMovementType();
	public static readonly Wander = new CharMovementType();
	public static readonly Patrol = new CharMovementType();
	public static readonly Scaredy = new CharMovementType();
	public static readonly Animation = new CharMovementType();
	public static readonly UnknownIndyOnly = new CharMovementType();

	public static readonly knownTypes = [
		CharMovementType.None,
		CharMovementType.Unspecific1,
		CharMovementType.Unspecific2,
		CharMovementType.Unspecific3,
		CharMovementType.Sit,
		CharMovementType.UnknownIndyOnly,
		CharMovementType.Unspecific4,
		CharMovementType.Unspecific5,
		CharMovementType.Droid,
		CharMovementType.Wander,
		CharMovementType.Patrol,
		CharMovementType.Scaredy,
		CharMovementType.Animation
	];

	get rawValue(): number {
		return CharMovementType.knownTypes.indexOf(this);
	}

	public get name() {
		switch (this) {
			case CharMovementType.None:
				return "None";
			case CharMovementType.Unspecific1:
				return "Unspecific1";
			case CharMovementType.Unspecific2:
				return "Unspecific2";
			case CharMovementType.Unspecific3:
				return "Unspecific3";
			case CharMovementType.Sit:
				return "Sit";
			case CharMovementType.Unspecific4:
				return "Unspecific4";
			case CharMovementType.Unspecific5:
				return "Unspecific5";
			case CharMovementType.Droid:
				return "Droid";
			case CharMovementType.Wander:
				return "Wander";
			case CharMovementType.Patrol:
				return "Patrol";
			case CharMovementType.Scaredy:
				return "Scaredy";
			case CharMovementType.Animation:
				return "Animation";
			case CharMovementType.UnknownIndyOnly:
				return "Unknown (Indy)";
			default:
				return "None";
		}
	}

	static isMovementType(number: number): boolean {
		return CharMovementType.knownTypes[number] !== undefined;
	}

	static fromNumber(number: number): CharMovementType {
		if (!this.isMovementType(number)) throw RangeError(`Invalid movment type ${number} specified!`);
		return CharMovementType.knownTypes[number];
	}

	public toString(): string {
		return `CharMovementType{${this.name}}`;
	}
}

export default CharMovementType;
