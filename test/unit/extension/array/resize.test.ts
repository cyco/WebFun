describe("WebFun.Extension.Array.resize", () => {
	it("it extends the Array prototype", () => {
		const array: any[] = [];
		expect(typeof array.resize).toBe("function");
	});

	it("removes all elements from an array and fills it up with the new element", () => {
		const array = ["a", "c"];

		array.resize(5, "test");
		expect(array).toEqual(["test", "test", "test", "test", "test"]);
		expect(array.length).toBe(5);
	});
});
