import Stream from "src/util/stream";

describe("WebFun.Util.Stream", () => {
	let subject: Stream;
	beforeEach(() => {
		subject = new Stream();
	});

	it("keeps track of the current position in the stram", () => {
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

	it("the endianess of the stream values can be set", () => {
		expect(subject.endianess).not.toBe(undefined);

		subject.endianess = Stream.Endian.Little;
		expect(subject.littleEndian).toBeTrue();
		subject.endianess = Stream.Endian.Big;
		expect(subject.littleEndian).toBeFalse();
	});
});
