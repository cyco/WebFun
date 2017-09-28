import Cheat from "src/engine/cheats/cheat";

describe("Cheat", () => {
	it("is an abstract class used to represent a cheat code", () => {
		expect(Cheat).toBeClass();
	});
});
