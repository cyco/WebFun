class CharacterMovementType {
	public static readonly None = new CharacterMovementType();
	public static readonly Unspecific1 = new CharacterMovementType();
	public static readonly Unspecific2 = new CharacterMovementType();
	public static readonly Unspecific3 = new CharacterMovementType();
	public static readonly Sit = new CharacterMovementType();
	public static readonly Unspecific4 = new CharacterMovementType();
	public static readonly Unspecific5 = new CharacterMovementType();
	public static readonly Droid = new CharacterMovementType();
	public static readonly Wander = new CharacterMovementType();
	public static readonly Patrol = new CharacterMovementType();
	public static readonly Scaredy = new CharacterMovementType();
	public static readonly Animation = new CharacterMovementType();
	public static readonly UnknownIndyOnly = new CharacterMovementType();

	public static readonly knownTypes = [
		CharacterMovementType.None,
		CharacterMovementType.Unspecific1,
		CharacterMovementType.Unspecific2,
		CharacterMovementType.Unspecific3,
		CharacterMovementType.Sit,
		CharacterMovementType.UnknownIndyOnly,
		CharacterMovementType.Unspecific4,
		CharacterMovementType.Unspecific5,
		CharacterMovementType.Droid,
		CharacterMovementType.Wander,
		CharacterMovementType.Patrol,
		CharacterMovementType.Scaredy,
		CharacterMovementType.Animation
	];

	get rawValue(): number {
		return CharacterMovementType.knownTypes.indexOf(this);
	}

	public get name(): string {
		switch (this) {
			case CharacterMovementType.None:
				return "None";
			case CharacterMovementType.Unspecific1:
				return "Unspecific1";
			case CharacterMovementType.Unspecific2:
				return "Unspecific2";
			case CharacterMovementType.Unspecific3:
				return "Unspecific3";
			case CharacterMovementType.Sit:
				return "Sit";
			case CharacterMovementType.Unspecific4:
				return "Unspecific4";
			case CharacterMovementType.Unspecific5:
				return "Unspecific5";
			case CharacterMovementType.Droid:
				return "Droid";
			case CharacterMovementType.Wander:
				return "Wander";
			case CharacterMovementType.Patrol:
				return "Patrol";
			case CharacterMovementType.Scaredy:
				return "Scaredy";
			case CharacterMovementType.Animation:
				return "Animation";
			case CharacterMovementType.UnknownIndyOnly:
				return "Unknown (Indy)";
			default:
				return "None";
		}
	}

	static isMovementType(number: number): boolean {
		return CharacterMovementType.knownTypes[number] !== undefined;
	}

	static fromNumber(number: number): CharacterMovementType {
		if (!this.isMovementType(number))
			throw RangeError(`Invalid movement type ${number} specified!`);
		return CharacterMovementType.knownTypes[number];
	}

	public toString(): string {
		return `CharMovementType{${this.name}}`;
	}
}

export default CharacterMovementType;
