import DiscardingOutputStream from "src/util/discarding-output-stream";

describe("DiscardingOutputStream", () => {
	let subject;
	beforeEach(() => (subject = new DiscardingOutputStream()));

	it("is an output stream that discards everything written", () => {
		expect(DiscardingOutputStream).toBeAClass();
	});

	it("advances offset when something is written", () => {
		expect(subject.buffer).toBeNull();

		subject.writeUint8(0);
		expect(subject.offset).toBe(1);

		subject.writeUint16(0);
		expect(subject.offset).toBe(3);

		subject.writeUint32(0);
		expect(subject.offset).toBe(7);

		subject.writeInt8(0);
		expect(subject.offset).toBe(8);

		subject.writeInt16(0);
		expect(subject.offset).toBe(10);

		subject.writeInt32(0);
		expect(subject.offset).toBe(14);

		subject.writeCharacters("ABCD");
		expect(subject.offset).toBe(18);

		subject.writeNullTerminatedString("A");
		expect(subject.offset).toBe(20);

		subject.writeLengthPrefixedString("AA");
		expect(subject.offset).toBe(24);

		subject.writeLengthPrefixedNullTerminatedString("A");
		expect(subject.offset).toBe(28);

		subject.writeUint8Array([1, 2, 3, 4]);
		expect(subject.offset).toBe(32);

		subject.writeUint16Array([1, 2, 3, 4]);
		expect(subject.offset).toBe(40);

		subject.writeInt16Array([1, 2, 3, 4]);
		expect(subject.offset).toBe(48);

		subject.writeUint32Array([1, 2, 3, 4]);
		expect(subject.offset).toBe(64);
	});
});
