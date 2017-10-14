import WorldSize from "src/engine/types/world-size";

describe("WorldSize", () => {
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

	it("can be converted to / from numbers for seriaization", () => {
		expect(WorldSize.fromNumber(WorldSize.toNumber(WorldSize.Small))).toBe(WorldSize.Small);
		expect(WorldSize.fromNumber(WorldSize.toNumber(WorldSize.Medium))).toBe(WorldSize.Medium);
		expect(WorldSize.fromNumber(WorldSize.toNumber(WorldSize.Large))).toBe(WorldSize.Large);
	});

	it("throws if invalid values are given as input", () => {
		expect(() => WorldSize.toNumber(4)).toThrow();
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
