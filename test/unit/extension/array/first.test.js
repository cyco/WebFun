describe("Array.first", () => {
	it("it extends the Array prototype", () => {
		let array = [];
		expect(typeof array.first).toBe("function");
	});

	it("simply returns the first element of an array", () => {
		let array = [ "a", "b", "c" ];
		let result = array.first();
		expect(result).toBe("a");
	});

	it("returns null if the array is empty", () => {
		let array = [];
		let result = array.first();
		expect(result).toBe(null);
	});
});
