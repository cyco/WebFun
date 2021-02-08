import ZonePlanet from "src/engine/objects/zone-planet";

describe("WebFun.Engine.Objects.ZonePlanet", () => {
	it("defines constants for the planets yoda can encounter", () => {
		expect(ZonePlanet.None).toBeDefined();

		expect(ZonePlanet.Tatooine).toBeDefined();
		expect(ZonePlanet.Dagobah).toBeDefined();
		expect(ZonePlanet.Endor).toBeDefined();
		expect(ZonePlanet.Hoth).toBeDefined();
	});

	it("always returns the same value for a size", () => {
		expect(ZonePlanet.Tatooine).toBe(ZonePlanet.Tatooine);
	});

	it("gives different values for different sizes", () => {
		expect(ZonePlanet.Tatooine).not.toBe(ZonePlanet.Hoth);
	});

	it("can be converted to / from numbers for easy serialization", () => {
		expect(ZonePlanet.fromNumber(ZonePlanet.Tatooine.rawValue)).toBe(ZonePlanet.Tatooine);
		expect(ZonePlanet.fromNumber(ZonePlanet.Hoth.rawValue)).toBe(ZonePlanet.Hoth);
		expect(ZonePlanet.fromNumber(ZonePlanet.Endor.rawValue)).toBe(ZonePlanet.Endor);
		expect(ZonePlanet.fromNumber(ZonePlanet.Load.rawValue)).toBe(ZonePlanet.Load);
	});

	it("throws if invalid values are given as input", () => {
		expect(() => ZonePlanet.fromNumber(100)).toThrow();
	});

	it("defines a name for each type", () => {
		expect(ZonePlanet.None.name).toBe("None");
		expect(ZonePlanet.Tatooine.name).toBe("Tatooine");
		expect(ZonePlanet.Hoth.name).toBe("Hoth");
		expect(ZonePlanet.Endor.name).toBe("Endor");
		expect(ZonePlanet.Dagobah.name).toBe("Dagobah");
		expect(ZonePlanet.Load.name).toBe("Load");

		spyOn(console, "assert");
		new ZonePlanet().name;
		expect(console.assert).toHaveBeenCalled();
	});

	it("can be used in switch / case statements", () => {
		switch (ZonePlanet.Endor) {
			case ZonePlanet.Endor:
				expect(true).toBeTruthy();
				break;
			default:
				expect(false).toBeFalsy();
		}
	});
});
