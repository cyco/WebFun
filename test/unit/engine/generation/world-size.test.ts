import WorldSize from "src/engine/generation/world-size";

describe("WebFun.Engine.Generation.WorldSize", () => {
	it("defines constants for the size of a world", () => {
		expect(WorldSize.Small).toBeDefined();
		expect(WorldSize.Medium).toBeDefined();
		expect(WorldSize.Large).toBeDefined();
	});

	it("always returns the same value for a size", () => {
		expect(WorldSize.Small).toBe(WorldSize.Small);
	});

	it("gives different values for different sizes", () => {
		expect(WorldSize.Small).not.toBe(WorldSize.Medium);
	});

	it("can be converted to / from numbers for easy serialization", () => {
		expect(WorldSize.fromNumber(WorldSize.Small.rawValue)).toBe(WorldSize.Small);
		expect(WorldSize.fromNumber(WorldSize.Medium.rawValue)).toBe(WorldSize.Medium);
		expect(WorldSize.fromNumber(WorldSize.Large.rawValue)).toBe(WorldSize.Large);
	});

	it("defines names for each size", () => {
		expect(WorldSize.Small.name).toBe("Small");
		expect(WorldSize.Medium.name).toBe("Medium");
		expect(WorldSize.Large.name).toBe("Large");
	});

	it("defines a custom string representation", () => {
		expect(WorldSize.Small.toString()).toBe("WorldSize {Small}");
	});

	it("throws if invalid values are given as input", () => {
		expect(() => WorldSize.fromNumber(4)).toThrow();
	});

	it("can be used in switch / case statements", () => {
		switch (WorldSize.Large) {
			case WorldSize.Large:
				expect(true).toBeTruthy();
				break;
			default:
				expect(false).toBeFalsy();
		}
	});
});
