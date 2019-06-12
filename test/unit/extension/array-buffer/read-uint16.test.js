import readUint16 from "src/extension/array-buffer/read-uint16";
import { getFixtureData } from "test/helpers/fixture-loading";

describe("WebFun.Extension.ArrayBuffer.readUint16", () => {
	let sampleBuffer;
	beforeAll(done => {
		getFixtureData("someData", function(buffer) {
			sampleBuffer = buffer;
			done();
		});
	});

	it("is a function extending the ArrayBuffer prototype", () => {
		expect(typeof sampleBuffer.readUint16).toBe("function");
	});

	it("returns 2 byte unsigned data at the specified position", () => {
		let word;

		word = readUint16.call(sampleBuffer, 0);
		expect(word).toBe(0x4223);

		word = readUint16.call(sampleBuffer, 2);
		expect(word).toBe(0xffff);
	});

	it("reads words that are not aligned", () => {
		let word;
		word = readUint16.call(sampleBuffer, 1);
		expect(word).toBe(0xff42);
	});
});
