import MapScene from "/engine/scenes/map-scene";

describe("MapScene", () => {
	it('can be instantiated without throwing exceptions', () => {
		expect(() => new MapScene()).not.toThrow();
	});
});

