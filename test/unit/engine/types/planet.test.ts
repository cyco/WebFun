import Planet from "src/engine/types/planet";

describe("WebFun.Engine.Types.Planet", () => {
	it("defines constants for the planets yoda can encounter", () => {
		expect(Planet.None).toBeDefined();

		expect(Planet.Tatooine).toBeDefined();
		expect(Planet.Dagobah).toBeDefined();
		expect(Planet.Endor).toBeDefined();
		expect(Planet.Hoth).toBeDefined();
	});

	it("always returns the same value for a size", () => {
		expect(Planet.Tatooine).toBe(Planet.Tatooine);
	});

	it("gives different values for different sizes", () => {
		expect(Planet.Tatooine).not.toBe(Planet.Hoth);
	});

	it("can be converted to / from numbers for easy serialization", () => {
		expect(Planet.fromNumber(Planet.Tatooine.rawValue)).toBe(Planet.Tatooine);
		expect(Planet.fromNumber(Planet.Hoth.rawValue)).toBe(Planet.Hoth);
		expect(Planet.fromNumber(Planet.Endor.rawValue)).toBe(Planet.Endor);
		expect(Planet.fromNumber(Planet.Load.rawValue)).toBe(Planet.Load);
	});

	it("throws if invalid values are given as input", () => {
		expect(() => Planet.fromNumber(100)).toThrow();
	});

	it("defines a name for each type", () => {
		expect(Planet.None.name).toBe("None");
		expect(Planet.Tatooine.name).toBe("Tatooine");
		expect(Planet.Hoth.name).toBe("Hoth");
		expect(Planet.Endor.name).toBe("Endor");
		expect(Planet.Dagobah.name).toBe("Dagobah");
		expect(Planet.Load.name).toBe("Load");

		spyOn(console, "assert");
		new Planet().name;
		expect(console.assert).toHaveBeenCalled();
	});

	it("can be used in switch / case statements", () => {
		switch (Planet.Endor) {
			case Planet.Endor:
				expect(true).toBeTruthy();
				break;
			default:
				expect(false).toBeFalsy();
		}
	});
});
