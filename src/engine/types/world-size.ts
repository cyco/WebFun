class WorldSize {
	public static readonly Small = new WorldSize();
	public static readonly Medium = new WorldSize();
	public static readonly Large = new WorldSize();

	private static readonly knownSizes = [WorldSize.Small, WorldSize.Medium, WorldSize.Large];

	get rawValue(): number {
		return WorldSize.knownSizes.indexOf(this) + 1;
	}

	public static isWorldSize(number: number): boolean {
		return number >= 1 && number <= WorldSize.knownSizes.length;
	}

	public static fromNumber(number: number): WorldSize {
		console.assert(WorldSize.isWorldSize(number), `Value ${number} does not specify a valid world size!`);
		return WorldSize.knownSizes[number - 1];
	}

	public toString(): string {
		return `WorldSize {${this.name}}`;
	}

	get name(): string {
		switch (this) {
			case WorldSize.Small:
				return "Small";
			case WorldSize.Medium:
				return "Medium";
			case WorldSize.Large:
				return "Large";
		}
	}
}

export default WorldSize;
