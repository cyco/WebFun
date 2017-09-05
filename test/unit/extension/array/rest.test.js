describe("Array.rest", () => {
	it("it extends the Array prototype", () => {
		let array = [];
		expect(typeof array.rest).toBe("function");
	});

	it("simply returns all but the first elements of an array", () => {
		let array = [ "a", "b", "c" ];
		let result = array.rest();
		expect(result).toEqual([ "b", "c" ]);
	});

	it("returns [] if the array is empty", () => {
		let array = [];
		let result = array.rest();
		expect(result).toEqual([]);
	});
});
