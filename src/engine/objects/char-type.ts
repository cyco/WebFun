class CharType {
	public static readonly Hero = new CharType();
	public static readonly Enemy = new CharType();
	public static readonly Weapon = new CharType();

	public static readonly knownTypes = [
		undefined,
		CharType.Hero,
		CharType.Enemy,
		undefined,
		CharType.Weapon
	];

	get rawValue(): number {
		return CharType.knownTypes.indexOf(this);
	}

	public get name(): string {
		switch (this) {
			case CharType.Hero:
				return "Hero";
			case CharType.Enemy:
				return "Enemy";
			case CharType.Weapon:
				return "Weapon";
			default:
				console.assert(false, "Invalid char type encountered");
		}
	}

	static isType(number: number): boolean {
		return CharType.knownTypes[number] !== undefined;
	}

	static fromNumber(number: number): CharType {
		if (!this.isType(number)) throw RangeError(`Invalid zone type ${number} specified!`);
		return CharType.knownTypes[number];
	}

	public toString(): string {
		return `CharType{${this.name}}`;
	}
}

export default CharType;
