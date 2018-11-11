import Stream from "src/util/stream";

describe("WebFun.Util.Stream", () => {
	let stream;
	beforeEach(() => {
		stream = new Stream();
	});

	it("keeps track of the current position in the stram", () => {
		expect(stream.offset).toBe(0);
	});

	it("has the function 'seek' to change the current position", () => {
		expect(typeof stream.seek).toBe("function");

		stream.seek(15, Stream.SEEK.SET);
		expect(stream.offset).toBe(15);
	});

	it("the offset can be changed relative to the current position", () => {
		stream.seek(15, Stream.SEEK.CUR);
		stream.seek(12, Stream.SEEK.CUR);
		expect(stream.offset).toBe(27);
	});

	it("the endianess of the streams values can be set", () => {
		expect(stream.endianess).not.toBe(undefined);

		stream.endianess = Stream.ENDIAN.LITTLE;
		expect(stream.littleEndian).toBeTrue();
		stream.endianess = Stream.ENDIAN.BIG;
		expect(stream.littleEndian).toBeFalse();
	});
});
