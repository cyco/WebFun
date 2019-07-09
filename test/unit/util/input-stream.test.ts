import InputStream from "src/util/input-stream";
import Stream from "src/util/stream";
import { getFixtureData } from "test/helpers/fixture-loading";

describe("WebFun.Util.InputStream", () => {
	let buffer: ArrayBuffer;
	let subject: InputStream;

	beforeEach(done => {
		getFixtureData("someData", b => {
			buffer = b;
			done();
		});
	});

	it("can be initialized using an array buffer as data source", () => {
		expect(() => {
			subject = new InputStream(buffer);
		}).not.toThrow();
		expect(subject.length).toBe(6);
	});

	it("can be initialized using a string as data source", () => {
		expect(() => {
			subject = new InputStream("test");
		}).not.toThrow();
		expect(subject.length).toBe(3);
	});

	it("has a method to check if more bytes are available", () => {
		subject = new InputStream("test");
		expect(subject.isAtEnd()).toBeFalse();
		subject.seek(subject.length, Stream.SEEK.SET);
		expect(subject.isAtEnd()).toBeTrue();
	});

	it("throws a TypeError if the constructor argument can't be transformed into an array buffer", () => {
		expect(() => new InputStream((5 as unknown) as any)).toThrow();
	});

	it("getUint8 returns 1 byte of unsigned data at the current position and advances the offset", () => {
		subject = new InputStream(buffer);

		expect(subject.offset).toBe(0);
		expect(subject.getUint8()).toBe(0x23);
		expect(subject.getUint8()).toBe(0x42);
		expect(subject.getUint8()).toBe(0xff);
		expect(subject.offset).toBe(3);
	});

	it("getUint16 returns 2 byte of unsigned data at the current position and advances the offset", () => {
		subject = new InputStream(buffer);

		expect(subject.offset).toBe(0);
		expect(subject.getUint16()).toBe(0x4223);
		expect(subject.offset).toBe(2);
		expect(subject.getUint16()).toBe(0xffff);
		expect(subject.offset).toBe(4);
	});

	it("getUint32 returns 4 byte of unsigned data at the current position and advances the offset", () => {
		subject = new InputStream(buffer);

		expect(subject.offset).toBe(0);
		expect(subject.getUint32()).toBe(0xffff4223);
		expect(subject.offset).toBe(4);
	});

	it("getInt8 returns 1 byte of signed data at the current position and advances the offset", () => {
		subject = new InputStream(buffer);

		expect(subject.offset).toBe(0);
		expect(subject.getInt8()).toBe(0x23);
		expect(subject.getInt8()).toBe(0x42);
		expect(subject.getInt8()).toBe(-1);
		expect(subject.offset).toBe(3);
	});

	it("getInt16 returns 2 byte of signed data at the current position and advances the offset", () => {
		subject = new InputStream(buffer);

		expect(subject.offset).toBe(0);
		expect(subject.getInt16()).toBe(0x4223);
		expect(subject.offset).toBe(2);
		expect(subject.getInt16()).toBe(-1);
		expect(subject.offset).toBe(4);
	});

	it("getInt32 returns 4 byte of signed data at the current position and advances the offset", () => {
		subject = new InputStream(buffer);

		expect(subject.offset).toBe(0);
		expect(subject.getInt32()).toBe(-48605);
		expect(subject.offset).toBe(4);
	});

	describe("string reading", () => {
		let buffer: ArrayBuffer;
		beforeAll(done => {
			getFixtureData("asciiString", function(b) {
				buffer = b;
				done();
			});
		});

		it("getCharacter reads a single byte character and returns it", () => {
			subject = new InputStream(buffer);

			subject.seek(2, Stream.SEEK.SET);
			expect(subject.offset).toBe(2);
			expect(subject.getCharacter()).toBe("A");
			expect(subject.offset).toBe(3);
		});

		it("getCharacters returns a string of length x at the current position", () => {
			subject = new InputStream(buffer);

			subject.seek(2, Stream.SEEK.SET);
			expect(subject.offset).toBe(2);
			expect(subject.getCharacters(5)).toBe("ASCII");
			expect(subject.offset).toBe(7);
		});

		it("getCharacters returns an empty string if length is zero", () => {
			subject = new InputStream(buffer);

			expect(subject.offset).toBe(0);
			expect(subject.getCharacters(0)).toBe("");
			expect(subject.offset).toBe(0);
		});

		it("getNullTerminatedString collects all characters up to a null byte into a string, it does not consume the null byte", () => {
			subject = new InputStream(buffer);

			subject.seek(2, Stream.SEEK.SET);
			expect(subject.offset).toBe(2);
			const string = subject.getNullTerminatedString(subject.length - 2);
			expect(string).toBe("ASCII STRING");
			expect(subject.offset).toBe(string.length + 2);
			expect(subject.getUint8()).toBe(0x00);
		});

		it("getLengthPrefixedString reads 2 bytes string length and then as many bytes characters returning them in a string", () => {
			subject = new InputStream(buffer);

			const string = subject.getLengthPrefixedString();
			expect(string).toBe("ASCII STRING");
		});

		it("getCStringWithLength reads a null terminated string consuming exactly n bytes", () => {
			let string;
			subject = new InputStream(buffer);

			subject.seek(0x12, Stream.SEEK.SET);
			string = subject.getCStringWithLength(1);
			expect(string).toBe("c");

			subject.seek(0x12, Stream.SEEK.SET);
			string = subject.getCStringWithLength(8);
			expect(string).toBe("c-string");

			subject.seek(0x12, Stream.SEEK.SET);
			string = subject.getCStringWithLength(9);
			expect(string).toBe("c-string");
		});
	});

	describe("array reading", () => {
		let buffer: ArrayBuffer;
		beforeAll(done => {
			getFixtureData("arrayReading", function(b) {
				buffer = b;
				done();
			});
		});

		it("getUint8Array reads an array of unsigned bytes", () => {
			subject = new InputStream(buffer);
			const data = subject.getUint8Array(4);
			expect(data.length).toBe(4);
			expect(data[0]).toBe(0x17);
			expect(data[1]).toBe(0x2a);
			expect(data[2]).toBe(0x23);
			expect(data[3]).toBe(0x42);
		});

		it("getUint16Array reads an array of unsigned words (length is specified in elements)", () => {
			subject = new InputStream(buffer);

			const data = subject.getUint16Array(4);
			expect(data.length).toBe(4);
			expect(data[0]).toBe(0x2a17);
			expect(data[1]).toBe(0x4223);
			expect(data[2]).toBe(0x2342);
			expect(data[3]).toBe(0x172a);
		});

		it("getInt16Array reads an array of signed words (length is specified in elements)", () => {
			subject = new InputStream(buffer);

			let data = subject.getInt16Array(2);
			expect(data[0]).toBe(10775);
			expect(data[1]).toBe(16931);

			subject.seek(1, Stream.SEEK.SET);
			data = subject.getInt16Array(2);
			expect(data[0]).toBe(0x232a);
			expect(data[1]).toBe(0x4242);
		});

		it("getUint16Array can be used even if the offset is not word aligned", () => {
			subject = new InputStream(buffer);
			subject.seek(1, Stream.SEEK.SET);
			expect(subject.offset).toBe(1);

			const data = subject.getUint16Array(2);
			expect(data.length).toBe(2);
			expect(data[0]).toBe(0x232a);
			expect(data[1]).toBe(0x4242);
		});

		it("getUint32Array can be used even if the offset is not dword aligned", () => {
			subject = new InputStream(buffer);
			subject.seek(1, Stream.SEEK.SET);
			expect(subject.offset).toBe(1);

			const data = subject.getUint32Array(1);
			expect(data.length).toBe(1);
			expect(data[0]).toBe(0x4242232a);

			expect(subject.offset).toBe(5);
		});

		it("getUint32Array can be used to read arrays of unsigned integers", () => {
			subject = new InputStream(buffer);
			expect(subject.offset).toBe(0);

			const data = subject.getUint32Array(1);
			expect(data.length).toBe(1);
			expect(data[0]).toBe(0x42232a17);

			expect(subject.offset).toBe(4);
		});
	});
});