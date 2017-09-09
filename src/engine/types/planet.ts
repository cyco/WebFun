class Planet {
	public static NONE = 0;
	public static TATOOINE = 1;
	public static HOTH = 2;
	public static ENDOR = 3;
	public static DAGOBAH = 5;

	_value: number;

	constructor(number: number) {
		const knownPlanets = [Planet.NONE, Planet.TATOOINE, Planet.HOTH, Planet.ENDOR, Planet.DAGOBAH];
		const planet = knownPlanets.find(p => p === number);
		if (planet) throw `Planets can not be instantiated. Use static constants or FromNumber instead!`;

		this._value = number;
	}

	get rawValue(): number {
		return this._value;
	}

	static isPlanet(number: number): boolean {
		const knownPlanets = [Planet.NONE, Planet.TATOOINE, Planet.HOTH, Planet.ENDOR, Planet.DAGOBAH];
		return !!knownPlanets.find(p => p === number);
	}

	static fromNumber(number: number): number {
		const knownPlanets = [Planet.NONE, Planet.TATOOINE, Planet.HOTH, Planet.ENDOR, Planet.DAGOBAH];
		const planet = knownPlanets.find(p => p === number);
		if (!planet) throw RangeError(`Invalid planet ${number} requested!`);
		return planet;
	}
}

export default Planet;
