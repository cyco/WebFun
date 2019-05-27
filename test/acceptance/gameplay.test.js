import { getFixtureContent } from "test/helpers";
import { Yoda } from "src/engine/type";

xdescribe("WebFun.Acceptance.Gameplay", () => {
	let rawData;
	beforeAll(async done => {
		rawData = await loadGameData(Yoda);
		done();
	});

	beforeEach(() => {});

	it("plays thorugh 0xDEAD", async done => {
		try {
			const input = getFixtureContent("input-1").split(" ");
			console.log("input length: ", input.length, "commands");
			done();
		} catch (e) {
			console.log("e", e);
		}
	});
});
