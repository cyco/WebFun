import PuzzleType from "src/engine/objects/puzzle-type";

describe("WebFun.Engine.Objects.PuzzleType", () => {
	it("is an enum for zone types", () => {
		expect(PuzzleType).toBeClass();
	});

	it("can be created from a number", () => {
		expect(PuzzleType.fromNumber(-1)).toBe(PuzzleType.Disabled);
		expect(PuzzleType.fromNumber(0xffff)).toBe(PuzzleType.Disabled);
		expect(PuzzleType.fromNumber(3)).toBe(PuzzleType.End);
		expect(() => PuzzleType.fromNumber(-10)).toThrow();
	});

	it("can be represented as a string", () => {
		expect(PuzzleType.Trade.name).toBe("Trade");
		expect(PuzzleType.Use.name).toBe("Use");
		expect(PuzzleType.Goal.name).toBe("Goal");
		expect(PuzzleType.End.name).toBe("End");
		expect(PuzzleType.U4.name).toBe("U4");
		expect(PuzzleType.U4.toString()).toBe("PuzzleType{U4}");
	});

	it("can be represented as a number", () => {
		expect(PuzzleType.Trade.rawValue).toBe(0);
		expect(PuzzleType.Use.rawValue).toBe(1);
		expect(PuzzleType.Goal.rawValue).toBe(2);
		expect(PuzzleType.End.rawValue).toBe(3);
		expect(PuzzleType.U4.rawValue).toBe(4);
		expect(PuzzleType.Disabled.rawValue).toBe(-1);
	});
});
