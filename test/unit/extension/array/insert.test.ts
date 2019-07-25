describe("WebFun.Extension.Array.insert", () => {
	it("it extends the Array prototype", () => {
		const array: any[] = [];
		expect(typeof array.insert).toBe("function");
	});

	it("inserts an element at the specified position", () => {
		const array = ["a", "c"];

		array.insert(1, "b");
		expect(array).toEqual(["a", "b", "c"]);
		expect(array.length).toBe(3);
	});
});
