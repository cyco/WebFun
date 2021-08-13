class CharacterType {
	public static readonly Hero = new CharacterType();
	public static readonly Enemy = new CharacterType();
	public static readonly Weapon = new CharacterType();

	public static readonly knownTypes = [
		undefined,
		CharacterType.Hero,
		CharacterType.Enemy,
		undefined,
		CharacterType.Weapon
	];

	get rawValue(): number {
		return CharacterType.knownTypes.indexOf(this);
	}

	public get name(): string {
		switch (this) {
			case CharacterType.Hero:
				return "Hero";
			case CharacterType.Enemy:
				return "Enemy";
			case CharacterType.Weapon:
				return "Weapon";
			default:
				console.assert(false, "Invalid char type encountered");
		}
	}

	static isType(number: number): boolean {
		return CharacterType.knownTypes[number] !== undefined;
	}

	static fromNumber(number: number): CharacterType {
		if (!this.isType(number)) throw RangeError(`Invalid zone type ${number} specified!`);
		return CharacterType.knownTypes[number];
	}

	public toString(): string {
		return `CharacterType{${this.name}}`;
	}
}

export default CharacterType;
