import { getFixtureData } from "test-helpers/fixture-loading";
import readUint32 from "/extension/array-buffer/read-uint32";

describe('ArrayBuffer reading', () => {
	let sampleBuffer;
	beforeAll((done) => {
		getFixtureData('someData', function (buffer) {
			sampleBuffer = buffer;
			done();
		});
	});

	describe('ArrayBuffer.readUint32', () => {
		it('is a function extending the ArrayBuffer prototype', () => {
			expect(typeof sampleBuffer.readUint32).toBe('function');
		});

		it('returns 4 byte unsigned data at the specified position', () => {
			let dword;

			dword = readUint32.call(sampleBuffer, 0);
			expect(dword).toBe(0xFFFF4223);
		});

		it('reads double words that are not aligned', () => {
			let dword;
			dword = readUint32.call(sampleBuffer, 1);
			expect(dword).toBe(0x00FFFF42);
		});
	});
});
