import InputStream from "src/util/input-stream";
import Stream from "src/util/stream";
import { getFixtureData } from "test/helpers/fixture-loading";

describe("WebFun.Util.InputStream", () => {
	let buffer: ArrayBuffer;
	let subject: InputStream;

	beforeEach(async () => (buffer = await getFixtureData("someData")));

	it("can be initialized using an array buffer as data source", () => {
		expect(() => (subject = new InputStream(buffer))).not.toThrow();
		expect(subject.length).toBe(6);
	});

	it("can be initialized using a string as data source", () => {
		expect(() => (subject = new InputStream("test"))).not.toThrow();
		expect(subject.length).toBe(3);
	});

	it("has a method to check if more bytes are available", () => {
		subject = new InputStream("test");
		expect(subject.isAtEnd()).toBeFalse();
		subject.seek(subject.length, Stream.Seek.Set);
		expect(subject.isAtEnd()).toBeTrue();
	});

	it("throws a TypeError if the constructor argument can't be transformed into an array buffer", () => {
		expect(() => new InputStream((5 as unknown) as any)).toThrow();
	});

	it("readUint8 returns 1 byte of unsigned data at the current position and advances the offset", () => {
		subject = new InputStream(buffer);

		expect(subject.offset).toBe(0);
		expect(subject.readUint8()).toBe(0x23);
		expect(subject.readUint8()).toBe(0x42);
		expect(subject.readUint8()).toBe(0xff);
		expect(subject.offset).toBe(3);
	});

	it("readUint16 returns 2 byte of unsigned data at the current position and advances the offset", () => {
		subject = new InputStream(buffer);

		expect(subject.offset).toBe(0);
		expect(subject.readUint16()).toBe(0x4223);
		expect(subject.offset).toBe(2);
		expect(subject.readUint16()).toBe(0xffff);
		expect(subject.offset).toBe(4);
	});

	it("readUint32 returns 4 byte of unsigned data at the current position and advances the offset", () => {
		subject = new InputStream(buffer);

		expect(subject.offset).toBe(0);
		expect(subject.readUint32()).toBe(0xffff4223);
		expect(subject.offset).toBe(4);
	});

	it("readInt8 returns 1 byte of signed data at the current position and advances the offset", () => {
		subject = new InputStream(buffer);

		expect(subject.offset).toBe(0);
		expect(subject.readInt8()).toBe(0x23);
		expect(subject.readInt8()).toBe(0x42);
		expect(subject.readInt8()).toBe(-1);
		expect(subject.offset).toBe(3);
	});

	it("readInt16 returns 2 byte of signed data at the current position and advances the offset", () => {
		subject = new InputStream(buffer);

		expect(subject.offset).toBe(0);
		expect(subject.readInt16()).toBe(0x4223);
		expect(subject.offset).toBe(2);
		expect(subject.readInt16()).toBe(-1);
		expect(subject.offset).toBe(4);
	});

	it("readInt32 returns 4 byte of signed data at the current position and advances the offset", () => {
		subject = new InputStream(buffer);

		expect(subject.offset).toBe(0);
		expect(subject.readInt32()).toBe(-48605);
		expect(subject.offset).toBe(4);
	});

	describe("string reading", () => {
		let buffer: ArrayBuffer;
		beforeAll(async () => (buffer = await getFixtureData("asciiString")));

		it("readCharacter reads a single byte character and returns it", () => {
			subject = new InputStream(buffer);

			subject.seek(2, Stream.Seek.Set);
			expect(subject.offset).toBe(2);
			expect(subject.readCharacter()).toBe("A");
			expect(subject.offset).toBe(3);
		});

		it("readCharacters returns a string of length x at the current position", () => {
			subject = new InputStream(buffer);

			subject.seek(2, Stream.Seek.Set);
			expect(subject.offset).toBe(2);
			expect(subject.readCharacters(5)).toBe("ASCII");
			expect(subject.offset).toBe(7);
		});

		it("readCharacters returns an empty string if length is zero", () => {
			subject = new InputStream(buffer);

			expect(subject.offset).toBe(0);
			expect(subject.readCharacters(0)).toBe("");
			expect(subject.offset).toBe(0);
		});

		it("readNullTerminatedString collects all characters up to a null byte into a string, it does not consume the null byte", () => {
			subject = new InputStream(buffer);

			subject.seek(2, Stream.Seek.Set);
			expect(subject.offset).toBe(2);
			const string = subject.readNullTerminatedString(subject.length - 2);
			expect(string).toBe("ASCII STRING");
			expect(subject.offset).toBe(string.length + 2);
			expect(subject.readUint8()).toBe(0x00);
		});

		it("readLengthPrefixedString reads 2 bytes string length and then as many bytes characters returning them in a string", () => {
			subject = new InputStream(buffer);

			const string = subject.readLengthPrefixedString();
			expect(string).toBe("ASCII STRING");
		});

		it("readCStringWithLength reads a null terminated string consuming exactly n bytes", () => {
			let string;
			subject = new InputStream(buffer);

			subject.seek(0x12, Stream.Seek.Set);
			string = subject.readCStringWithLength(1);
			expect(string).toBe("c");

			subject.seek(0x12, Stream.Seek.Set);
			string = subject.readCStringWithLength(8);
			expect(string).toBe("c-string");

			subject.seek(0x12, Stream.Seek.Set);
			string = subject.readCStringWithLength(9);
			expect(string).toBe("c-string");
		});
	});

	describe("array reading", () => {
		let buffer: ArrayBuffer;
		beforeAll(async () => (buffer = await getFixtureData("arrayReading")));

		it("readUint8Array reads an array of unsigned bytes", () => {
			subject = new InputStream(buffer);
			const data = subject.readUint8Array(4);
			expect(data.length).toBe(4);
			expect(data[0]).toBe(0x17);
			expect(data[1]).toBe(0x2a);
			expect(data[2]).toBe(0x23);
			expect(data[3]).toBe(0x42);
		});

		it("readUint16Array reads an array of unsigned words (length is specified in elements)", () => {
			subject = new InputStream(buffer);

			const data = subject.readUint16Array(4);
			expect(data.length).toBe(4);
			expect(data[0]).toBe(0x2a17);
			expect(data[1]).toBe(0x4223);
			expect(data[2]).toBe(0x2342);
			expect(data[3]).toBe(0x172a);
		});

		it("readInt16Array reads an array of signed words (length is specified in elements)", () => {
			subject = new InputStream(buffer);

			let data = subject.readInt16Array(2);
			expect(data[0]).toBe(10775);
			expect(data[1]).toBe(16931);

			subject.seek(1, Stream.Seek.Set);
			data = subject.readInt16Array(2);
			expect(data[0]).toBe(0x232a);
			expect(data[1]).toBe(0x4242);
		});

		it("readUint16Array can be used even if the offset is not word aligned", () => {
			subject = new InputStream(buffer);
			subject.seek(1, Stream.Seek.Set);
			expect(subject.offset).toBe(1);

			const data = subject.readUint16Array(2);
			expect(data.length).toBe(2);
			expect(data[0]).toBe(0x232a);
			expect(data[1]).toBe(0x4242);
		});

		it("readUint32Array can be used even if the offset is not dword aligned", () => {
			subject = new InputStream(buffer);
			subject.seek(1, Stream.Seek.Set);
			expect(subject.offset).toBe(1);

			const data = subject.readUint32Array(1);
			expect(data.length).toBe(1);
			expect(data[0]).toBe(0x4242232a);

			expect(subject.offset).toBe(5);
		});

		it("readUint32Array can be used to read arrays of unsigned integers", () => {
			subject = new InputStream(buffer);
			expect(subject.offset).toBe(0);

			const data = subject.readUint32Array(1);
			expect(data.length).toBe(1);
			expect(data[0]).toBe(0x42232a17);

			expect(subject.offset).toBe(4);
		});

		it("readInt32Array can be used to read arrays of signed integers", async () => {
			let buffer = await getFixtureData("someData");
			subject = new InputStream(buffer);

			expect(subject.offset).toBe(0);
			expect(subject.readInt32Array(1)[0]).toBe(-48605);
			expect(subject.offset).toBe(4);

			buffer = await getFixtureData("asciiString");
			subject = new InputStream(buffer);

			subject.seek(0x0d, Stream.Seek.Set);
			expect(subject.offset).toBe(13);
			expect(subject.readInt32Array(1)[0]).toBe(-575864761);
			expect(subject.offset).toBe(17);
		});
	});

	it("offers access to the underlying array buffer", () => {
		const buffer = new ArrayBuffer(10);
		const subject = new InputStream(buffer);

		expect(subject.buffer).toBe(buffer);
	});
});
