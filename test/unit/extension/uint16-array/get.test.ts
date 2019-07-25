import get from "src/extension/uint16-array/get";

describe("WebFun.Extension.Uint16Array.get", () => {
	let subject: Uint16Array;
	beforeEach(() => (subject = new Uint16Array(100)));

	it("extends the Uint16Array prototype to provide 2d access on a 10 by 10 map", () => {
		expect(subject.get).toBeFunction();
	});

	it("returns the correct values", () => {
		subject[0] = 1;
		subject[1] = 2;
		subject[9] = 3;
		subject[10] = 4;
		subject[20] = 5;
		subject[99] = 6;

		expect(subject.get(0, 0)).toBe(1);
		expect(subject.get(1, 0)).toBe(2);
		expect(subject.get(9, 0)).toBe(3);
		expect(subject.get(0, 1)).toBe(4);
		expect(subject.get(0, 2)).toBe(5);
		expect(subject.get(9, 9)).toBe(6);
	});

	it("returns -1 if the index is out of bounds", () => {
		expect(subject.get(10, 10)).toBe(-1);
	});
});
