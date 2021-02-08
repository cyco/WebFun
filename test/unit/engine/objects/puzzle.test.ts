import Puzzle from "src/engine/objects/puzzle";
import Zone from "src/engine/objects/zone";

describe("WebFun.Engine.Objects.Puzzle", () => {
	let subject: Puzzle;
	beforeEach(() => (subject = new Puzzle()));

	it("might be a goal", () => {
		expect(subject.isGoalOnPlanet(Zone.Planet.Endor)).toBeFalse();
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
