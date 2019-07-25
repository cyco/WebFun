describe("WebFun.Extension.Array.rest", () => {
	it("it extends the Array prototype", () => {
		const array: any[] = [];
		expect(typeof array.rest).toBe("function");
	});

	it("simply returns all but the first elements of an array", () => {
		const array = ["a", "b", "c"];
		const result = array.rest();
		expect(result).toEqual(["b", "c"]);
	});

	it("returns [] if the array is empty", () => {
		const array: any[] = [];
		const result = array.rest();
		expect(result).toEqual([]);
	});
});
