import set from "src/extension/uint16-array/set";

describe("WebFun.Extension.Uint16Array.set", () => {
	let subject: Uint16Array;
	beforeEach(() => (subject = new Uint16Array(100)));

	it("extends the Uint16Array prototype to provide 2d access on a 10 by 10 map", () => {
		expect(subject.set).toBeFunction();
	});

	it("returns the correct values", () => {
		subject.set(0, 0, 1);
		expect(subject[0]).toBe(1);
		subject.set(1, 0, 2);
		expect(subject[1]).toBe(2);
		subject.set(9, 0, 3);
		expect(subject[9]).toBe(3);
		subject.set(0, 1, 4);
		expect(subject[10]).toBe(4);
		subject.set(0, 2, 5);
		expect(subject[20]).toBe(5);
		subject.set(9, 9, 6);
		expect(subject[99]).toBe(6);
	});
});
