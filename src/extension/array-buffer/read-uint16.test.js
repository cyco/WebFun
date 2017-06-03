import { getFixtureData } from 'test-helpers/fixture-loading';
import readUint16 from '/extension/array-buffer/read-uint16';

describe('ArrayBuffer reading', () => {
	let sampleBuffer;
	beforeEach((done) => {
		getFixtureData('someData', function(buffer) {
			sampleBuffer = buffer;
			done();
		});
	});

	describe('ArrayBuffer.readUint16', () => {
		it('is a function extending the ArrayBuffer prototype', () => {
			expect(typeof sampleBuffer.readUint16).toBe('function');
		});

		it('returns 2 byte unsigned data at the specified position', () => {
			let word;

			word = readUint16.call(sampleBuffer, 0);
			expect(word).toBe(0x4223);

			word = readUint16.call(sampleBuffer, 2);
			expect(word).toBe(0xFFFF);
		});

		it('reads words that are not aligned', () => {
			let word;
			word = readUint16.call(sampleBuffer, 1);
			expect(word).toBe(0xFF42);
		});
	});
});
