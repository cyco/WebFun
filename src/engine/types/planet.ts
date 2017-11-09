class Planet {
	public static readonly NONE = new Planet();
	public static readonly TATOOINE = new Planet();
	public static readonly HOTH = new Planet();
	public static readonly ENDOR = new Planet();
	public static readonly DAGOBAH = new Planet();

	public static readonly UNKNOWN = new Planet();

	private static readonly knownPlanets = [Planet.NONE, Planet.TATOOINE, Planet.HOTH, Planet.ENDOR, Planet.DAGOBAH, Planet.UNKNOWN];

	get rawValue(): number {
		return Planet.knownPlanets.indexOf(this);
	}

	static isPlanet(number: number): boolean {
		return number >= 0 && number < Planet.knownPlanets.length;
	}

	static fromNumber(number: number): Planet {
		if (!this.isPlanet(number)) throw RangeError(`Invalid planet ${number} specified!`);
		return Planet.knownPlanets[number];
	}

	get name() {
		switch (this) {
			case Planet.NONE:
				return "None";
			case Planet.TATOOINE:
				return "Tatooine";
			case Planet.HOTH:
				return "Hoth";
			case Planet.ENDOR:
				return "Endor";
			case Planet.DAGOBAH:
				return "Dagobah";
			case Planet.UNKNOWN:
				return "Unknown";
			default:
				console.assert(false, "Unknown planet encountered!");
		}
	}
}

export default Planet;
