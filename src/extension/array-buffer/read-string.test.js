import { getFixtureData } from "test-helpers/fixture-loading";
import readString from "./read-string";

describe('ArrayBuffer.readString', () => {
	let sampleBuffer;
	beforeAll((done) => {
		getFixtureData('asciiString', function (buffer) {
			sampleBuffer = buffer;
			done();
		});
	});

	it('is a function extending the ArrayBuffer prototype', () => {
		expect(typeof sampleBuffer.readString).toBe('function');
	});

	it('returns a fixed-length string read from the supplied offset', () => {
		let string;

		string = sampleBuffer.readString(2, 5);
		expect(string).toBe('ASCII');

		string = readString.call(sampleBuffer, 2, 0xC);
		expect(string).toBe('ASCII STRING');

		string = sampleBuffer.readString(8, 6);
		expect(string).toBe('STRING');
	});

	it('returns an empty string if length is zero', () => {
		let string = sampleBuffer.readString(123903, 0);
		expect(string).toBe('');

		string = readString.call(sampleBuffer, 123903, 0);
		expect(string).toBe('');
	});
});
