import WorldSize from "/engine/types/world-size";

describe("WorldSize", () => {
	it('defines constants for the size of a world', () => {
		expect(WorldSize).toHaveNumber('SMALL');
		expect(WorldSize).toHaveNumber('MEDIUM');
		expect(WorldSize).toHaveNumber('LARGE');
	});
});
