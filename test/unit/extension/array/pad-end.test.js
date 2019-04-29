import padEnd from "src/extension/array/pad-end";

describe("WebFun.Extension.Array.padEnd", () => {
	it("extends the Array prototype", () => {
		const array = [1, 2, 3];
		expect(array.padEnd).toBeFunction();
	});

	it("add the fill character to the back of an array to pad it to the specified length", () => {
		let result = [1, 2, 3].padEnd(5, 0);
		expect(result).toEqual([1, 2, 3, 0, 0]);

		result = padEnd.call([1, 2, 3], 5, 0);
		expect(result).toEqual([1, 2, 3, 0, 0]);
	});

	it("does not change the original array", () => {
		const original = [1, 2, 3];
		const result = original.padEnd(5, 0);
		expect(original).not.toBe(result);
		expect(original).toEqual([1, 2, 3]);
	});
});
