class Planet {
	public static readonly NONE = new Planet();
	public static readonly TATOOINE = new Planet();
	public static readonly HOTH = new Planet();
	public static readonly ENDOR = new Planet();
	public static readonly DAGOBAH = new Planet();

	public static readonly UNKNOWN = new Planet();

	private static readonly knownPlanets = [Planet.NONE, Planet.TATOOINE, Planet.HOTH, Planet.ENDOR, Planet.DAGOBAH, Planet.UNKNOWN];

	static isPlanet(number: number): boolean {
		return number >= 0 && number < Planet.knownPlanets.length;
	}

	static fromNumber(number: number): Planet {
		if (!this.isPlanet(number)) throw RangeError(`Invalid planet ${number} specified!`);
		return Planet.knownPlanets[number];
	}

	get rawValue(): number {
		return Planet.knownPlanets.indexOf(this);
	}
}

export default Planet;
