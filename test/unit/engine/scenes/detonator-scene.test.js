import DetonatorScene from "src/engine/scenes/detonator-scene";

describe("DetonatorScene", () => {
	it("can be instantiated without throwing exceptions", () => {
		expect(() => new DetonatorScene()).not.toThrow();
	});
});

