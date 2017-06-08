import { getFixtureData } from 'test/helpers/fixture-loading';

import { InputStream } from 'src/util';
import Reader from 'src/engine/data-format/file';

describe('Data Reading', () => {
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
