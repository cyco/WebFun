import clear from "src/extension/array/clear";

describe("WebFun.Extension.Array.clear", () => {
	it("it extends the Array prototype", () => {
		const array = [];
		expect(typeof clear).toBe("function");
		expect(typeof array.clear).toBe("function");
		expect(typeof Array.prototype.clear).toBe("function");
	});

	it("removes all elements from an array", () => {
		const array = ["a", "b", "c"];
		clear.call(array);
		expect(array.length).toBe(0);
		expect(array[0]).toBe(undefined);
	});

	it("does nothing on empty arrays", () => {
		const array = [];
		expect(() => {
			array.clear();
		}).not.toThrow();
		expect(array.length).toBe(0);
	});
});
