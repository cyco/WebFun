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

		subject.seek(15, Stream.SEEK.SET);
		expect(subject.offset).toBe(15);
	});

	it("the offset can be changed relative to the current position", () => {
		subject.seek(15, Stream.SEEK.CUR);
		subject.seek(12, Stream.SEEK.CUR);
		expect(subject.offset).toBe(27);
	});

	it("the endianess of the stream values can be set", () => {
		expect(subject.endianess).not.toBe(undefined);

		subject.endianess = Stream.ENDIAN.LITTLE;
		expect(subject.littleEndian).toBeTrue();
		subject.endianess = Stream.ENDIAN.BIG;
		expect(subject.littleEndian).toBeFalse();
	});
});
