import Cheat from "src/engine/cheats/cheat";

describe("WebFun.Unit.Engine.Cheats.Cheat", () => {
	it("is an abstract class used to represent a cheat code", () => {
		expect(Cheat).toBeClass();
	});
});
