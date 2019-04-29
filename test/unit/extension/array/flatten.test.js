import flatten from "src/extension/array/flatten";

describe("WebFun.Extension.Array.flatten", () => {
	it("it extends the Array prototype", () => {
		const array = [];
		expect(array.flatten).toBeFunction();
		expect(flatten).toBeFunction();
	});

	it("creates a new array from the elements of the arrays contained", () => {
		const sample = [["a"], ["b"], ["c", "d"]];

		let result = sample.flatten();
		expect(result.length).toBe(4);
		expect(result[0]).toBe("a");
		expect(result[3]).toBe("d");

		result = flatten.call(sample);
		expect(result.length).toBe(4);
		expect(result[0]).toBe("a");
		expect(result[3]).toBe("d");
	});

	it("returns an empty array if the original array is empty", () => {
		const sample = [];
		const result = sample.flatten();
		expect(result.length).toBe(0);
	});

	it("works if there are non-array elements", () => {
		const sample = [["a", "b"], "c"];
		const result = sample.flatten();
		expect(result.length).toBe(3);
		expect(result[2]).toBe("c");
	});

	it("only flattens one layer of arrays", () => {
		const sample = [["a", ["b"]], "c"];
		const result = sample.flatten();
		expect(result.length).toBe(3);
		expect(result[1]).toEqual(["b"]);
	});

	it("leaves the original array untouched", () => {
		const sample = [["a"]];
		sample.flatten();
		expect(sample[0] instanceof Array).toBeTrue();
	});
});
