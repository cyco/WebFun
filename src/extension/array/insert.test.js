describe("Array.insert", () => {
	it("it extends the Array prototype", () => {
		let array = [];
		expect(typeof array.insert).toBe("function");
	});

	it("inserts an element at the specified position", () => {
		let array = ["a", "c"];

		array.insert(1, "b");
		expect(array).toEqual(["a", "b", "c"]);
		expect(array.length).toBe(3);
	});
});
