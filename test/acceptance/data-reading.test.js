import { getFixtureData } from '../helpers/fixture-loading';

import { InputStream } from '/util';
import Reader from '/engine/file-format/file';

describe('Data Reading', function() {
	let data = null;
	beforeAll((done) => {
		getFixtureData('yoda.data', (buffer) => {
			data = Reader(new InputStream(buffer));
			done();
		});
	});

	it('reads all zones', () => {
		expect(data.ZONE.length).toBe(658);
	});

	it('reads all tiles', () => {
		expect(data.TILE.tiles.length).toBe(2123);
	});

	it('reads all sounds', () => {
		expect(data.SNDS.items.length).toBe(64);
	});
});
