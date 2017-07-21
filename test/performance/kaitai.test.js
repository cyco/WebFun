import { getFixtureData } from '../helpers/fixture-loading';

import KaitaiStream from 'kaitai-struct/KaitaiStream';
import Yodesk from '/engine/file-format/yodesk.ksy';

describe('Kaitai-Struct parsing', () => {
	let gameDataBuffer;
	beforeAll((done) => getFixtureData('yoda.data', (buffer) => {
		gameDataBuffer = buffer;
		done();
	}));

	it('parses the file correctly without taking too long', () => {
		const start = performance.now();
		const yodesk = new Yodesk(new KaitaiStream(gameDataBuffer));
		const end = performance.now();
		console.log('Kaitai duration: ', end - start, 'ms');
	});
});
