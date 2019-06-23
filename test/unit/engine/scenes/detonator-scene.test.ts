import DetonatorScene from "src/engine/scenes/detonator-scene";

describe("WebFun.Engine.Scenes.DetonatorScene", () => {
	it("can be instantiated without throwing exceptions", () => {
		expect(() => new DetonatorScene()).not.toThrow();
	});
});
