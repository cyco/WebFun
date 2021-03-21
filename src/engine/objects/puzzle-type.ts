class PuzzleType {
	public static readonly Use = new PuzzleType();
	public static readonly Trade = new PuzzleType();
	public static readonly Goal = new PuzzleType();
	public static readonly End = new PuzzleType();
	public static readonly U4 = new PuzzleType();

	public static readonly None = new PuzzleType();
	public static readonly Disabled = new PuzzleType();

	private static knownTypes = [
		PuzzleType.Use,
		PuzzleType.Trade,
		PuzzleType.Goal,
		PuzzleType.End,
		PuzzleType.U4
	];

	public get rawValue(): number {
		if (this === PuzzleType.Disabled) return -1;
		if (this === PuzzleType.None) return -1;

		return PuzzleType.knownTypes.indexOf(this);
	}

	public get name(): string {
		switch (this) {
			case PuzzleType.Use:
				return "Use";
			case PuzzleType.Trade:
				return "Trade";
			case PuzzleType.Goal:
				return "Goal";
			case PuzzleType.End:
				return "End";
			case PuzzleType.U4:
				return "U4";
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
