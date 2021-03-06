import OutputStream from "src/util/output-stream";
import Stream from "src/util/stream";

describe("WebFun.Util.OutputStream", () => {
	let outputStream: OutputStream;
	it("is a class used to write data", () => {
		outputStream = new OutputStream(1);
		expect(typeof outputStream.writeUint8).toBe("function");
		expect(outputStream.buffer).toBeInstanceOf(ArrayBuffer);
	});

	it("defaults to using little endian", () => {
		outputStream = new OutputStream(2);

		outputStream.writeUint16(0x4223);

		expect(getByte(0)).toBe(0x23);
		expect(getByte(1)).toBe(0x42);
	});

	it("but endianness can be changed at any time", () => {
		outputStream = new OutputStream(8);

		outputStream.endianness = Stream.Endian.Big;
		outputStream.writeUint16(0x4223);
		expect(getByte(0)).toBe(0x42);
		expect(getByte(1)).toBe(0x23);

		outputStream.endianness = Stream.Endian.Little;
		outputStream.writeUint16(0x4223);
		expect(getByte(2)).toBe(0x23);
		expect(getByte(3)).toBe(0x42);
	});

	it("has a function to write a byte", () => {
		outputStream = new OutputStream(2);

		outputStream.writeUint8(0x42);
		outputStream.writeUint8(0x23);

		expect(getByte(0)).toBe(0x42);
		expect(getByte(1)).toBe(0x23);
	});

	it("has a function to write a word", () => {
		outputStream = new OutputStream(2);

		outputStream.writeUint16(0x4223);

		expect(getByte(0)).toBe(0x23);
		expect(getByte(1)).toBe(0x42);
	});

	it("has a function to write a double word", () => {
		outputStream = new OutputStream(4);

		outputStream.writeUint32(0x42230550);

		expect(getByte(0)).toBe(0x50);
		expect(getByte(1)).toBe(0x05);
		expect(getByte(2)).toBe(0x23);
		expect(getByte(3)).toBe(0x42);
	});

	it("has a function to write a signed byte", () => {
		outputStream = new OutputStream(2);

		outputStream.writeInt8(-1);
		outputStream.writeInt8(0x23);

		expect(getByte(0)).toBe(0xff);
		expect(getByte(1)).toBe(0x23);
	});

	it("has a function to write a signed word", () => {
		outputStream = new OutputStream(2);

		outputStream.writeInt16(-1);

		expect(getByte(0)).toBe(0xff);
		expect(getByte(1)).toBe(0xff);
	});

	it("has a function to write a signed double word", () => {
		outputStream = new OutputStream(4);

		outputStream.writeInt32(-1);

		expect(getByte(0)).toBe(0xff);
		expect(getByte(1)).toBe(0xff);
		expect(getByte(2)).toBe(0xff);
		expect(getByte(3)).toBe(0xff);
	});

	it("has a function to write a bunch of characters to the stream", () => {
		outputStream = new OutputStream(4);

		outputStream.writeCharacters("test");

		expect(getByte(0)).toBe(0x74);
		expect(getByte(1)).toBe(0x65);
		expect(getByte(2)).toBe(0x73);
		expect(getByte(3)).toBe(0x74);
	});

	it("has a function to write a null terminated string", () => {
		outputStream = new OutputStream(5);

		outputStream.writeNullTerminatedString("test");

		expect(getByte(0)).toBe(0x74);
		expect(getByte(1)).toBe(0x65);
		expect(getByte(2)).toBe(0x73);
		expect(getByte(3)).toBe(0x74);
		expect(getByte(4)).toBe(0x00);
	});

	it("has a function to write a length-prefixed string", () => {
		outputStream = new OutputStream(6);

		outputStream.writeLengthPrefixedString("test");

		expect(getByte(0)).toBe(0x04);
		expect(getByte(1)).toBe(0x00);
		expect(getByte(2)).toBe(0x74);
		expect(getByte(3)).toBe(0x65);
		expect(getByte(4)).toBe(0x73);
		expect(getByte(5)).toBe(0x74);
	});

	it("has a function to write a length-prefixed string with null terminator", () => {
		outputStream = new OutputStream(7);

		outputStream.writeLengthPrefixedNullTerminatedString("test");

		expect(getByte(0)).toBe(0x05);
		expect(getByte(1)).toBe(0x00);
		expect(getByte(2)).toBe(0x74);
		expect(getByte(3)).toBe(0x65);
		expect(getByte(4)).toBe(0x73);
		expect(getByte(5)).toBe(0x74);
		expect(getByte(6)).toBe(0x00);
	});

	it("has a function to write a byte array to the stream", () => {
		outputStream = new OutputStream(2);
		const array = new Uint8Array(2);
		array[0] = 0x23;
		array[1] = 0x42;
		outputStream.writeUint8Array(array);

		expect(getByte(0)).toBe(0x23);
		expect(getByte(1)).toBe(0x42);
	});

	it("has a function to write a signed byte array to the stream", () => {
		outputStream = new OutputStream(2);
		const array = new Int8Array(2);
		array[0] = -1;
		array[1] = 0x42;
		outputStream.writeInt8Array(array);

		expect(getByte(0)).toBe(0xff);
		expect(getByte(1)).toBe(0x42);
	});

	it("has a function to write a word array to the stream", () => {
		outputStream = new OutputStream(2);
		const array = new Uint16Array(1);
		array[0] = 0x2342;
		outputStream.writeUint16Array(array);

		expect(getByte(0)).toBe(0x42);
		expect(getByte(1)).toBe(0x23);
	});

	it("has a function to write a signed word array to the stream", () => {
		outputStream = new OutputStream(2);
		const array = new Int16Array(1);
		array[0] = -1;
		outputStream.writeInt16Array(array);

		expect(getByte(0)).toBe(0xff);
		expect(getByte(1)).toBe(0xff);
	});

	it("has a function to write an unsigned double word array to the stream", () => {
		outputStream = new OutputStream(4);
		const array = new Uint32Array(1);
		array[0] = 0x23420500;
		outputStream.writeUint32Array(array);

		expect(getByte(0)).toBe(0x00);
		expect(getByte(1)).toBe(0x05);
		expect(getByte(2)).toBe(0x42);
		expect(getByte(3)).toBe(0x23);
	});

	it("has a function to write a signed double word array to the stream", () => {
		outputStream = new OutputStream(4);
		const array = new Int32Array(1);
		array[0] = -1;
		outputStream.writeInt32Array(array);

		expect(getByte(0)).toBe(0xff);
		expect(getByte(1)).toBe(0xff);
		expect(getByte(2)).toBe(0xff);
		expect(getByte(3)).toBe(0xff);

		array[0] = 0x10203040;
		outputStream = new OutputStream(4);
		outputStream.writeInt32Array(array);

		expect(getByte(0)).toBe(0x40);
		expect(getByte(1)).toBe(0x30);
		expect(getByte(2)).toBe(0x20);
		expect(getByte(3)).toBe(0x10);
	});

	it("throws an exception if the pre-specified size is exceeded", () => {
		outputStream = new OutputStream(1);
		outputStream.writeUint8(0x42);

		expect(() => {
			outputStream.writeUint8(0x23);
		}).toThrow();
	});

	function getByte(offset: number) {
		return new DataView((outputStream as any)._arrayBuffer, offset).getUint8(0);
	}
});
