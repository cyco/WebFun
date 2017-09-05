describe("Array.erase", () => {
	it("it extends the Array prototype", () => {
		let array = [];
		expect(typeof array.erase).toBe("function");
	});

	it("removes the element at the specified position from an array", () => {
		let array = [ "a", "b", "c" ];

		array.erase(0);
		expect(array).toEqual([ "b", "c" ]);
		expect(array.length).toBe(2);

		array.erase(1);
		expect(array).toEqual([ "b" ]);
		expect(array.length).toBe(1);

		array.erase(0);
		expect(array).toEqual([]);
		expect(array.length).toBe(0);
	});
});
