import ZoneScene from '/engine/scenes/zone-scene';

describe("ZoneScene", () => {
	it('can be instantiated without throwing exceptions', () => {
		expect(() => new ZoneScene()).not.toThrow();
	});
});
