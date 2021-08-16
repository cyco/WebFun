class PuzzleType {
	public static readonly Transaction = new PuzzleType();
	public static readonly Offer = new PuzzleType();
	public static readonly Goal = new PuzzleType();
	public static readonly Mission = new PuzzleType();
	public static readonly Unknown = new PuzzleType();

	public static readonly None = new PuzzleType();
	public static readonly Disabled = new PuzzleType();

	private static knownTypes = [
		PuzzleType.Transaction,
		PuzzleType.Offer,
		PuzzleType.Goal,
		PuzzleType.Mission,
		PuzzleType.Unknown
	];

	public get rawValue(): number {
		if (this === PuzzleType.Disabled) return -1;
		if (this === PuzzleType.None) return -1;

		return PuzzleType.knownTypes.indexOf(this);
	}

	public get name(): string {
		switch (this) {
			case PuzzleType.Transaction:
				return "Transaction";
			case PuzzleType.Offer:
				return "Offer";
			case PuzzleType.Goal:
				return "Goal";
			case PuzzleType.Mission:
				return "Mission";
			case PuzzleType.Unknown:
				return "Unknown";
			case PuzzleType.None:
				return "None";
		}
	}

	public static isPuzzleType(number: number): boolean {
		if (number === -1 || number === 0xffff) return true;
		if (0 <= number && number < PuzzleType.knownTypes.length) return true;

		return false;
	}

	public static fromNumber(number: number): PuzzleType {
		if (!PuzzleType.isPuzzleType(number))
			throw new RangeError(`Value ${number} does not specify a puzzle type`);

		if (number === -1 || number === 0xffff) return PuzzleType.Disabled;
		return this.knownTypes[number];
	}

	public toString(): string {
		return `PuzzleType{${this.name}}`;
	}
}

export default PuzzleType;
