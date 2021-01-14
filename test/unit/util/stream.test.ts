import Stream from "src/util/stream";

describe("WebFun.Util.Stream", () => {
	let subject: Stream;
	beforeEach(() => {
		subject = new Stream();
	});

	it("keeps track of the current position in the stream", () => {
		expect(subject.offset).toBe(0);
	});

	it("has the function 'seek' to change the current position", () => {
		expect(typeof subject.seek).toBe("function");

		subject.seek(15, Stream.Seek.Set);
		expect(subject.offset).toBe(15);
	});

	it("the offset can be changed relative to the current position", () => {
		subject.seek(15, Stream.Seek.Cur);
		subject.seek(12, Stream.Seek.Cur);
		expect(subject.offset).toBe(27);
	});

	it("the endianness of the stream values can be set", () => {
		expect(subject.endianness).not.toBe(undefined);

		subject.endianness = Stream.Endian.Little;
		expect(subject.littleEndian).toBeTrue();
		subject.endianness = Stream.Endian.Big;
		expect(subject.littleEndian).toBeFalse();
	});
});
