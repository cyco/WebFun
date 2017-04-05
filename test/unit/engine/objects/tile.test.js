import Tile from '/engine/objects/tile';

describe('Tile', () => {
	it('is a class representing a game tile', () => {
		let tile = new Tile();
		expect(tile instanceof Tile).toBe(true);
	});
});
