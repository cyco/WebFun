describe("Array.unique", () => {
	it("it extends the Array prototype", () => {
		let array = [];
		expect(typeof array.unique).toBe("function");
	});

	it("it removes all duplicate elements from an array only keeping one", () => {
		let array = ["a", "b", "c", "a"];
		let result = array.unique();
		expect(result).toEqual(["a", "b", "c"]);
	});

	it("it works on objects", () => {
		let object = {a: 5};
		let array = [object, "a", object];
		let result = array.unique();
		expect(result).toEqual([object, "a"]);
	});

	it("it checks objects for identity and is not stable", () => {
		let object = {a: 5};
		let similarObject = {a: 5};
		let array = [object, "a", similarObject];
		let result = array.unique();
		expect(result).toEqual([object, similarObject, "a"]);
	});
});
