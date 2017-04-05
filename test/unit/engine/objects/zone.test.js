import Zone from '/engine/objects/zone';

describe('Zone', () => {
	it('is a class representing an ingame map', () => {
		let zone = new Zone();
		expect(zone instanceof Zone).toBe(true);
	});
});
