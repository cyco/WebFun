import Puzzle from "src/engine/objects/puzzle";

describe("WebFun.Engine.Objects.Puzzle", () => {
	let subject: Puzzle;
	beforeEach(() => (subject = new Puzzle()));

	it("has default values", () => {
		expect(subject.id).toBe(-1);
		expect(subject.item1).toBeNull();
		expect(subject.item2).toBeNull();
		expect(subject.strings).toEqual(["", "", "", "", ""]);
		expect(subject.name).toBe("");
		expect(subject.type).toBeNull();
		expect(subject.item1Class).toBe(Puzzle.ItemClass.None);
		expect(subject.item2Class).toBe(Puzzle.ItemClass.None);
		expect(subject.unknown3).toBeNull();
	});
});
