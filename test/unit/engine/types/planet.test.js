import Planet from "src/engine/types/planet";

describe("Planet", () => {
	it("defines constants for the planets yoda can encounter", () => {
		expect(Planet.NONE).not.toBeUndefined();

		expect(Planet.TATOOINE).not.toBeUndefined();
		expect(Planet.DAGOBAH).not.toBeUndefined();
		expect(Planet.ENDOR).not.toBeUndefined();
		expect(Planet.HOTH).not.toBeUndefined();
	});
});
