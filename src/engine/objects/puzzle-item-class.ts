class PuzzleItemClass {
	public static readonly Keycard = new PuzzleItemClass();
	public static readonly Part = new PuzzleItemClass();
	public static readonly Tool = new PuzzleItemClass();
	public static readonly Valuable = new PuzzleItemClass();

	public static readonly None = new PuzzleItemClass();

	private static knownTypes = [
		PuzzleItemClass.Keycard,
		PuzzleItemClass.Tool,
		PuzzleItemClass.Part,
		PuzzleItemClass.Valuable,
		PuzzleItemClass.None
	];

	public get rawValue(): number {
		if (this === PuzzleItemClass.None) return -1;

		switch (this) {
			case PuzzleItemClass.Keycard:
				return 0;
			case PuzzleItemClass.Tool:
				return 1;
			case PuzzleItemClass.Part:
				return 2;
			case PuzzleItemClass.Valuable:
				return 4;
		}
	}

	public get name(): string {
		switch (this) {
			case PuzzleItemClass.Keycard:
				return "Keycard";
			case PuzzleItemClass.Part:
				return "Part";
			case PuzzleItemClass.Tool:
				return "Tool";
			case PuzzleItemClass.Valuable:
				return "Valuable";
			case PuzzleItemClass.None:
				return "None";
		}
	}

	public static isPuzzleItemClass(value: number): boolean {
		if (value === -1 || value === 0xffff || value === 0xffffffff) return true;
		return this.knownTypes.some(t => t.rawValue === value);
	}

	public static fromNumber(value: number): PuzzleItemClass {
		if (!PuzzleItemClass.isPuzzleItemClass(value))
			throw new RangeError(`Value ${value} does not specify a puzzle item class`);

		if (value === -1 || value === 0xffff || value === 0xffffffff) return PuzzleItemClass.None;
		return this.knownTypes.find(t => t.rawValue === value);
	}

	public toString(): string {
		return `PuzzleItemClass{${this.name}}`;
	}
}

export default PuzzleItemClass;
