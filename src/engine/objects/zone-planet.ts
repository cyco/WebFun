class ZonePlanet {
	public static readonly None = new ZonePlanet();
	public static readonly Tatooine = new ZonePlanet();
	public static readonly Hoth = new ZonePlanet();
	public static readonly Endor = new ZonePlanet();
	public static readonly Dagobah = new ZonePlanet();
	public static readonly Load = new ZonePlanet();

	private static readonly knownPlanets = [
		ZonePlanet.None,
		ZonePlanet.Tatooine,
		ZonePlanet.Hoth,
		ZonePlanet.Endor,
		undefined,
		ZonePlanet.Dagobah
	];

	get rawValue(): number {
		return ZonePlanet.knownPlanets.indexOf(this);
	}

	static isPlanet(number: number): boolean {
		return (
			number === -1 ||
			(number >= 0 &&
				number < ZonePlanet.knownPlanets.length &&
				ZonePlanet.knownPlanets[number] !== undefined)
		);
	}

	static fromNumber(number: number): ZonePlanet {
		console.assert(this.isPlanet(number), `Invalid planet ${number} specified!`);
		if (number === -1) return ZonePlanet.Load;
		return ZonePlanet.knownPlanets[number];
	}

	get name(): string {
		switch (this) {
			case ZonePlanet.None:
				return "None";
			case ZonePlanet.Tatooine:
				return "Tatooine";
			case ZonePlanet.Hoth:
				return "Hoth";
			case ZonePlanet.Endor:
				return "Endor";
			case ZonePlanet.Dagobah:
				return "Dagobah";
			case ZonePlanet.Load:
				return "Load";
			default:
				console.assert(false, "Unknown planet encountered!", this);
		}
	}
}

export default ZonePlanet;
