import Cheat from "src/engine/cheats/cheat";

describe("Cheat", () => {
	let subject;
	beforeEach(() => subject = new Cheat());

	it("is an abstract class used to represent a cheat code", () => {
		expect(subject.execute instanceof Function).toBeTrue();
		expect(subject.code).toBe(null);
		expect(subject.message).toBe(null);
		expect(() => subject.execute(null)).not.toThrow();
	});
});
