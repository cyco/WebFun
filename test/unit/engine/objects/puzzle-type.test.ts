import PuzzleType from "src/engine/objects/puzzle-type";

describe("WebFun.Engine.Objects.PuzzleType", () => {
	it("is an enum for zone types", () => {
		expect(PuzzleType).toBeClass();
	});

	it("can be created from a number", () => {
		expect(PuzzleType.fromNumber(-1)).toBe(PuzzleType.Disabled);
		expect(PuzzleType.fromNumber(0xffff)).toBe(PuzzleType.Disabled);
		expect(PuzzleType.fromNumber(3)).toBe(PuzzleType.Mission);
		expect(() => PuzzleType.fromNumber(-10)).toThrow();
	});

	it("can be represented as a string", () => {
		expect(PuzzleType.Transaction.name).toBe("Transaction");
		expect(PuzzleType.Offer.name).toBe("Offer");
		expect(PuzzleType.Goal.name).toBe("Goal");
		expect(PuzzleType.Mission.name).toBe("Mission");
		expect(PuzzleType.Unknown.name).toBe("Unknown");
		expect(PuzzleType.Unknown.toString()).toBe("PuzzleType{Unknown}");
	});

	it("can be represented as a number", () => {
		expect(PuzzleType.Transaction.rawValue).toBe(0);
		expect(PuzzleType.Offer.rawValue).toBe(1);
		expect(PuzzleType.Goal.rawValue).toBe(2);
		expect(PuzzleType.Mission.rawValue).toBe(3);
		expect(PuzzleType.Unknown.rawValue).toBe(4);
		expect(PuzzleType.Disabled.rawValue).toBe(-1);
	});
});
