describe("WebFun.Extension.Array.unique", () => {
	it("it extends the Array prototype", () => {
		const array: any[] = [];
		expect(typeof array.unique).toBe("function");
	});

	it("it removes all duplicate elements from an array only keeping one", () => {
		const array = ["a", "b", "c", "a"];
		const result = array.unique();
		expect(result).toEqual(["a", "b", "c"]);
	});

	it("it works on objects", () => {
		const object = { a: 5 };
		const array = [object, "a", object];
		const result = array.unique();
		expect(result).toEqual([object, "a"]);
	});

	it("it checks objects for identity and is not stable", () => {
		const object = { a: 5 };
		const similarObject = { a: 5 };
		const array = [object, "a", similarObject];
		const result = array.unique();
		expect(result).toEqual([object, similarObject, "a"]);
	});
});
