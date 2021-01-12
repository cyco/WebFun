class Planet {
	public static readonly None = new Planet();
	public static readonly Tatooine = new Planet();
	public static readonly Hoth = new Planet();
	public static readonly Endor = new Planet();
	public static readonly Dagobah = new Planet();
	public static readonly Load = new Planet();

	private static readonly knownPlanets = [
		Planet.None,
		Planet.Tatooine,
		Planet.Hoth,
		Planet.Endor,
		undefined,
		Planet.Dagobah
	];

	get rawValue(): number {
		return Planet.knownPlanets.indexOf(this);
	}

	static isPlanet(number: number): boolean {
		return (
			number === -1 ||
			(number >= 0 &&
				number < Planet.knownPlanets.length &&
				Planet.knownPlanets[number] !== undefined)
		);
	}

	static fromNumber(number: number): Planet {
		console.assert(this.isPlanet(number), `Invalid planet ${number} specified!`);
		if (number === -1) return Planet.Load;
		return Planet.knownPlanets[number];
	}

	get name(): string {
		switch (this) {
			case Planet.None:
				return "None";
			case Planet.Tatooine:
				return "Tatooine";
			case Planet.Hoth:
				return "Hoth";
			case Planet.Endor:
				return "Endor";
			case Planet.Dagobah:
				return "Dagobah";
			case Planet.Load:
				return "Load";
			default:
				console.assert(false, "Unknown planet encountered!", this);
		}
	}
}

export default Planet;
