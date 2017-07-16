
import { getFixtureData } from '../helpers/fixture-loading';

import { InputStream } from 'src/util';
import Reader from 'src/engine/data-format/file';

describe('Meta-functional parsing', () => {
	let buffer = null;
	beforeAll((done) => {
		getFixtureData('yoda.data', (b) => {
			buffer = b;
			done();
		});
	});

	it('reads game data in a resonable time frame', () => {
		const start = performance.now();

		const result = Reader(new InputStream(buffer));
		const end = performance.now();

		console.log('Meta functional duration: ', end - start, 'ms');
	});
});
