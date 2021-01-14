import Action from "src/engine/objects/action";

describe("WebFun.Engine.Objects.Action", () => {
	let subject: Action;
	beforeEach(() => (subject = new Action()));

	it("can have several conditions", () => {
		expect(subject.conditions).toEqual([]);
	});

	it("can have several instructions", () => {
		expect(subject.instructions).toEqual([]);
	});

	it("has an instruction pointer that is initially set to 0", () => {
		expect(subject.instructionPointer).toBe(0);
	});

	it("has an id", () => {
		expect(subject.id).toBe(-1);
	});

	it("is initially enabled", () => {
		expect(subject.enabled).toBeTrue();
	});

	it("holds a reference to its zone", () => {
		expect(subject.zone).toBeNull();
	});

	it("has a name (even though it's only used in indy)", () => {
		expect(subject.name).toBe("");
	});
});
