describe("Array.last", () => {
	it("it extends the Array prototype", () => {
		let array = [];
		expect(typeof array.last).toBe("function");
	});

	it("simply returns the last element of an array", () => {
		let array = ["a", "b", "c"];
		let result = array.last();
		expect(result).toBe("c");
	});

	it("returns null if the array is empty", () => {
		let array = [];
		let result = array.last();
		expect(result).toBe(null);
	});
});
