class WorldSize {
	public static readonly Small = <WorldSize>Symbol();
	public static readonly Medium = <WorldSize>Symbol();
	public static readonly Large = <WorldSize>Symbol();

	public static fromNumber(number: 1|2|3): WorldSize {
		if (number === 1) return WorldSize.Small;
		if (number === 2) return WorldSize.Medium;
		if (number === 3) return WorldSize.Large;

		throw `Value ${number} does not specify a valid world size!`;
	}

	public static toNumber(size: WorldSize) {
		if (size === WorldSize.Small) return 1;
		if (size === WorldSize.Medium) return 2;
		if (size === WorldSize.Large) return 3;

		throw `Value ${size} does not specify a valid world size!`;
	}

	constructor() {
		throw `Can not instantiate a type`;
	}
}

export default WorldSize;
