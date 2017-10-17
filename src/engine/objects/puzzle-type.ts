class PuzzleType {
	public static readonly U1 = new PuzzleType();
	public static readonly U2 = new PuzzleType();
	public static readonly U3 = new PuzzleType();
	public static readonly End = new PuzzleType();
	public static readonly U4 = new PuzzleType();

	public static readonly Disabled = new PuzzleType();
	private static knownTypes = [PuzzleType.U1, PuzzleType.U2, PuzzleType.U3, PuzzleType.End, PuzzleType.U4];

	public static isPuzzleType(number: number): boolean {
		if (number === -1 || number === 0xFFFF) return true;
		if (number < PuzzleType.knownTypes.length) return true;

		return false;
	}

	public static fromNumber(number: number): PuzzleType {
		if (!PuzzleType.isPuzzleType(number)) throw new RangeError(`Value ${number} does not specify a puzzle type`);

		if (number === -1 || number === 0xFFFF) return PuzzleType.Disabled;
		return this.knownTypes[number];
	}

	public get rawValue() {
		if (this === PuzzleType.Disabled) return -1;

		return PuzzleType.knownTypes.indexOf(this);
	}

	public toString(){
		return `PuzzleType{${this.name}}`;
	}

	private get name(){
		switch(this) {
			case PuzzleType.U1: return 'U1';
			case PuzzleType.U2: return 'U2';
			case PuzzleType.U3: return 'U3';
			case PuzzleType.End: return 'End';
			case PuzzleType.U4: return 'U4';
		}
	}
}

export default PuzzleType;
