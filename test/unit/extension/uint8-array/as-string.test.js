import asString from "src/extension/uint8-array/as-string";
import { getFixtureData } from "test-helpers/fixture-loading";

describe("WebFun.Extension.Uint8Array.asString", () => {
	let buffer;
	beforeEach(done => {
		getFixtureData("asciiString", function(b) {
			buffer = b;
			done();
		});
	});

	it("returns the contents interpreted as char codes", () => {
		const array = new Uint8Array(buffer, 2, 5);
		expect(array.asString()).toBe("ASCII");
		expect(typeof asString).toBe("function");
	});
});
