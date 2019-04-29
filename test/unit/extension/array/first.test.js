describe("WebFun.Extension.Array.first", () => {
	it("it extends the Array prototype", () => {
		const array = [];
		expect(typeof array.first).toBe("function");
	});

	it("simply returns the first element of an array", () => {
		const array = ["a", "b", "c"];
		const result = array.first();
		expect(result).toBe("a");
	});

	it("returns null if the array is empty", () => {
		const array = [];
		const result = array.first();
		expect(result).toBe(null);
	});
});
