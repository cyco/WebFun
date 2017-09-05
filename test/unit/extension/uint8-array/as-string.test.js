import { getFixtureData } from "test-helpers/fixture-loading";
import asString from "src/extension/uint8-array/as-string";

describe("Uint8Array.asString", () => {
	let buffer;
	beforeEach((done) => {
		getFixtureData("asciiString", function (b) {
			buffer = b;
			done();
		});
	});

	it("returns the contents interpreted as char codes", () => {
		let array = new Uint8Array(buffer, 2, 5);
		expect(array.asString()).toBe("ASCII");
		expect(typeof asString).toBe("function");
	});
});
