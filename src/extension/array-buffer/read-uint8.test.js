import { getFixtureData } from "test-helpers/fixture-loading";
import readUint8 from "/extension/array-buffer/read-uint8";

describe('ArrayBuffer reading', () => {
	let sampleBuffer;
	beforeEach((done) => {
		getFixtureData('someData', function (buffer) {
			sampleBuffer = buffer;
			done();
		});
	});

	describe('ArrayBuffer.readUint8', () => {
		it('is a function extending the ArrayBuffer prototype', () => {
			expect(typeof sampleBuffer.readUint8).toBe('function');
		});

		it('returns 1 byte unsigned data at the specified position', () => {
			let byte;

			byte = sampleBuffer.readUint8(0);
			expect(byte).toBe(0x23);

			byte = sampleBuffer.readUint8(1);
			expect(byte).toBe(0x42);

			byte = sampleBuffer.readUint8(2);
			expect(byte).toBe(255);

			byte = readUint8.call(sampleBuffer, 3);
			expect(byte).toBe(0xFF);
		});
	});
});
