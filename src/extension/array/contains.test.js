describe("Array.contains", () => {
	it("extends the Array prototype", () => {
		expect(typeof Array.prototype.contains).toBe("function");
	});

	it("returns true if the array contains the specified item", () => {
		let array = [1, 2, 3];
		expect(array.contains(2)).toBeTrue();

		array = ["test", "value", "in", "array"];
		expect(array.contains("test")).toBeTrue();
	});

	it("returns false if the array does not contain the specified item", () => {
		let array = [1, 2, 3];
		expect(array.contains(6)).toBeFalse();

		array = ["test", "value", "in", "array"];
		expect(array.contains("something")).toBeFalse();
	});
});
