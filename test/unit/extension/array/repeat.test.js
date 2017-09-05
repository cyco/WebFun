import Repeat from "src/extension/array/repeat";

describe("Array.Repeat", () => {
	it("is a static function", () => {
		expect(typeof Repeat).toBe("function");
		expect(typeof Array.Repeat).toBe("function");
	});

	it("creates a new array of the specified length and fills it " +
		"with the first argument passed in",
		() => {
			let array = Array.Repeat("something", 10);
			expect(array.length).toBe(10);
			expect(array[0]).toBe("something");
			expect(array[9]).toBe("something");
		});
});
