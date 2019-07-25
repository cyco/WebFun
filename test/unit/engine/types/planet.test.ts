import Planet from "src/engine/types/planet";

describe("WebFun.Engine.Types.Planet", () => {
	it("defines constants for the planets yoda can encounter", () => {
		expect(Planet.NONE).toBeDefined();

		expect(Planet.TATOOINE).toBeDefined();
		expect(Planet.DAGOBAH).toBeDefined();
		expect(Planet.ENDOR).toBeDefined();
		expect(Planet.HOTH).toBeDefined();
	});

	it("always returns the same value for a size", () => {
		expect(Planet.TATOOINE).toBe(Planet.TATOOINE);
	});

	it("gives different values for different sizes", () => {
		expect(Planet.TATOOINE).not.toBe(Planet.HOTH);
	});

	it("can be converted to / from numbers for easy serialization", () => {
		expect(Planet.fromNumber(Planet.TATOOINE.rawValue)).toBe(Planet.TATOOINE);
		expect(Planet.fromNumber(Planet.HOTH.rawValue)).toBe(Planet.HOTH);
		expect(Planet.fromNumber(Planet.ENDOR.rawValue)).toBe(Planet.ENDOR);
		expect(Planet.fromNumber(Planet.LOAD.rawValue)).toBe(Planet.LOAD);
	});

	it("throws if invalid values are given as input", () => {
		expect(() => Planet.fromNumber(100)).toThrow();
	});

	it("defines a name for each type", () => {
		expect(Planet.NONE.name).toBe("None");
		expect(Planet.TATOOINE.name).toBe("Tatooine");
		expect(Planet.HOTH.name).toBe("Hoth");
		expect(Planet.ENDOR.name).toBe("Endor");
		expect(Planet.DAGOBAH.name).toBe("Dagobah");
		expect(Planet.LOAD.name).toBe("Load");

		spyOn(console, "assert");
		new Planet().name;
		expect(console.assert).toHaveBeenCalled();
	});

	it("can be used in switch / case statements", () => {
		switch (Planet.ENDOR) {
			case Planet.ENDOR:
				expect(true).toBeTruthy();
				break;
			default:
				expect(false).toBeFalsy();
		}
	});
});
