import Planet from "src/engine/types/planet";

describe("Planet", () => {
	it("defines constants for the planets yoda can encounter", () => {
		expect(Planet).toHaveMember("NONE");

		expect(Planet).toHaveMember("TATOOINE");
		expect(Planet).toHaveMember("DAGOBAH");
		expect(Planet).toHaveMember("ENDOR");
		expect(Planet).toHaveMember("HOTH");
	});
});
