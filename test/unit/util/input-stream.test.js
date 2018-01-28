import InputStream from "src/util/input-stream";
import Stream from "src/util/stream";
import { getFixtureData } from "test-helpers/fixture-loading";

describe("InputStream", () => {
	let buffer;
	beforeAll(done => {
		getFixtureData("someData", function(b) {
			buffer = b;
			done();
		});
	});

	it("can be initialized using an array buffer as data source", () => {
		let stream;
		expect(() => {
			stream = new InputStream(buffer);
		}).not.toThrow();
		expect(stream.length).toBe(6);
	});

	it("can be initialized using a string as data source", () => {
		let stream;
		expect(() => {
			stream = new InputStream("test");
		}).not.toThrow();
		expect(stream.length).toBe(3);
	});

	it("throws a TypeError if the constructor argument can't be transformed into an array buffer", () => {
		let stream;
		expect(() => {
			stream = new InputStream(5);
		}).toThrow(new TypeError());
	});

	it("getUint8 returns 1 byte of unsigned data at the current position and advances the offset", () => {
		let stream = new InputStream(buffer);

		expect(stream.offset).toBe(0);
		expect(stream.getUint8()).toBe(0x23);
		expect(stream.getUint8()).toBe(0x42);
		expect(stream.getUint8()).toBe(0xff);
		expect(stream.offset).toBe(3);
	});

	it("getUint16 returns 2 byte of unsigned data at the current position and advances the offset", () => {
		let stream = new InputStream(buffer);

		expect(stream.offset).toBe(0);
		expect(stream.getUint16()).toBe(0x4223);
		expect(stream.offset).toBe(2);
		expect(stream.getUint16()).toBe(0xffff);
		expect(stream.offset).toBe(4);
	});

	it("getUint32 returns 4 byte of unsigned data at the current position and advances the offset", () => {
		let stream = new InputStream(buffer);

		expect(stream.offset).toBe(0);
		expect(stream.getUint32()).toBe(0xffff4223);
		expect(stream.offset).toBe(4);
	});

	it("getInt8 returns 1 byte of signed data at the current position and advances the offset", () => {
		let stream = new InputStream(buffer);

		expect(stream.offset).toBe(0);
		expect(stream.getInt8()).toBe(0x23);
		expect(stream.getInt8()).toBe(0x42);
		expect(stream.getInt8()).toBe(-1);
		expect(stream.offset).toBe(3);
	});

	it("getInt16 returns 2 byte of signed data at the current position and advances the offset", () => {
		let stream = new InputStream(buffer);

		expect(stream.offset).toBe(0);
		expect(stream.getInt16()).toBe(0x4223);
		expect(stream.offset).toBe(2);
		expect(stream.getInt16()).toBe(-1);
		expect(stream.offset).toBe(4);
	});

	it("getInt32 returns 4 byte of signed data at the current position and advances the offset", () => {
		let stream = new InputStream(buffer);

		expect(stream.offset).toBe(0);
		expect(stream.getInt32()).toBe(-48605);
		expect(stream.offset).toBe(4);
	});

	describe("string reading", () => {
		beforeAll(done => {
			getFixtureData("asciiString", function(b) {
				buffer = b;
				done();
			});
		});

		it("getCharacter reads a single byte character and returns it", () => {
			let stream = new InputStream(buffer);

			stream.seek(2, Stream.SEEK.SET);
			expect(stream.offset).toBe(2);
			expect(stream.getCharacter()).toBe("A");
			expect(stream.offset).toBe(3);
		});

		it("getCharacters returns a string of length x at the current position", () => {
			let stream = new InputStream(buffer);

			stream.seek(2, Stream.SEEK.SET);
			expect(stream.offset).toBe(2);
			expect(stream.getCharacters(5)).toBe("ASCII");
			expect(stream.offset).toBe(7);
		});

		it("getCharacters returns an empty string if length is zero", () => {
			let stream = new InputStream(buffer);

			expect(stream.offset).toBe(0);
			expect(stream.getCharacters(0)).toBe("");
			expect(stream.offset).toBe(0);
		});

		it("getNullTerminatedString collects all characters up to a null byte into a string, it does not consume the null byte", () => {
			let stream = new InputStream(buffer);

			stream.seek(2, Stream.SEEK.SET);
			expect(stream.offset).toBe(2);
			let string = stream.getNullTerminatedString(stream.length - 2);
			expect(string).toBe("ASCII STRING");
			expect(stream.offset).toBe(string.length + 2);
			expect(stream.getUint8()).toBe(0x00);
		});

		it("getLengthPrefixedString reads 2 bytes string length and then as many bytes characters returning them in a string", () => {
			let stream = new InputStream(buffer);

			let string = stream.getLengthPrefixedString();
			expect(string).toBe("ASCII STRING");
		});
	});

	describe("array reading", () => {
		beforeAll(done => {
			getFixtureData("arrayReading", function(b) {
				buffer = b;
				done();
			});
		});

		it("getUint8Array reads an array of unsigned bytes", () => {
			let stream = new InputStream(buffer);
			let data = stream.getUint8Array(4);
			expect(data.length).toBe(4);
			expect(data[0]).toBe(0x17);
			expect(data[1]).toBe(0x2a);
			expect(data[2]).toBe(0x23);
			expect(data[3]).toBe(0x42);
		});

		it("getUint16Array reads an array of unsigned words (length is specified in elements)", () => {
			let stream = new InputStream(buffer);

			let data = stream.getUint16Array(4);
			expect(data.length).toBe(4);
			expect(data[0]).toBe(0x2a17);
			expect(data[1]).toBe(0x4223);
			expect(data[2]).toBe(0x2342);
			expect(data[3]).toBe(0x172a);
		});

		it("getUint16Array can be used even if the offset is not word aligned", () => {
			let stream = new InputStream(buffer);
			stream.seek(1, Stream.SEEK.SET);
			expect(stream.offset).toBe(1);

			let data = stream.getUint16Array(2);
			expect(data.length).toBe(2);
			expect(data[0]).toBe(0x232a);
			expect(data[1]).toBe(0x4242);
		});

		it("getUint32Array can be used even if the offset is not dword aligned", () => {
			let stream = new InputStream(buffer);
			stream.seek(1, Stream.SEEK.SET);
			expect(stream.offset).toBe(1);

			let data = stream.getUint32Array(1);
			expect(data.length).toBe(1);
			expect(data[0]).toBe(0x4242232a);

			expect(stream.offset).toBe(5);
		});

		it("getUint32Array can be used to read arrays of unsigned integers", () => {
			let stream = new InputStream(buffer);
			expect(stream.offset).toBe(0);

			let data = stream.getUint32Array(1);
			expect(data.length).toBe(1);
			expect(data[0]).toBe(0x42232a17);

			expect(stream.offset).toBe(4);
		});
	});
});
