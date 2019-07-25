import readUint32 from "src/extension/array-buffer/read-uint32";
import { getFixtureData } from "test/helpers/fixture-loading";

describe("WebFun.Extension.ArrayBuffer.readUint32", () => {
	let sampleBuffer: ArrayBuffer;
	beforeAll(done => {
		getFixtureData("someData", function(buffer) {
			sampleBuffer = buffer;
			done();
		});
	});

	it("is a function extending the ArrayBuffer prototype", () => {
		expect(typeof sampleBuffer.readUint32).toBe("function");
	});

	it("returns 4 byte unsigned data at the specified position", () => {
		let dword;

		dword = readUint32.call(sampleBuffer, 0);
		expect(dword).toBe(0xffff4223);
	});

	it("reads double words that are not aligned", () => {
		let dword;
		dword = readUint32.call(sampleBuffer, 1);
		expect(dword).toBe(0x00ffff42);
	});
});
