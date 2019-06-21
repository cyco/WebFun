import Puzzle from "src/engine/objects/puzzle";
import Planet from "src/engine/types/planet";

describe("WebFun.Engine.Objects.Puzzle", () => {
	let subject: Puzzle;
	beforeEach(() => (subject = new Puzzle()));

	it("might be a goal", () => {
		expect(subject.isGoalOnPlanet(Planet.ENDOR)).toBeFalse();
	});

	it("has default values", () => {
		expect(subject.id).toBe(-1);
		expect(subject.item1).toBeNull();
		expect(subject.item2).toBeNull();
		expect(subject.strings).toEqual(["", "", "", "", ""]);
		expect(subject.name).toBe("");
		expect(subject.type).toBeNull();
		expect(subject.unknown1).toBeNull();
		expect(subject.unknown2).toBeNull();
		expect(subject.unknown3).toBeNull();
	});
});
