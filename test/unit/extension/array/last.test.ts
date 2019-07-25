describe("WebFun.Extension.Array.last", () => {
	it("it extends the Array prototype", () => {
		const array: any[] = [];
		expect(typeof array.last).toBe("function");
	});

	it("simply returns the last element of an array", () => {
		const array = ["a", "b", "c"];
		const result = array.last();
		expect(result).toBe("c");
	});

	it("returns null if the array is empty", () => {
		const array: any[] = [];
		const result = array.last();
		expect(result).toBe(null);
	});
});
