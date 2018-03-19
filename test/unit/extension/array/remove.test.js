describe("Array.remove", () => {
	it("it extends the Array prototype", () => {
		let array = [];
		expect(array.remove).toBeFunction();
	});

	it("simply removes the element from the array", () => {
		let array = ["a", "b", "c"];
		array.remove("b");
		expect(array).toEqual(["a", "c"]);
	});

	it("only removes the first instance of an element", () => {
		let array = ["b", "b", "c", "b"];
		array.remove("b");
		expect(array).toEqual(["b", "c", "b"]);
	});

	it("returns true if the element was removed", () => {
		expect(["a"].remove("a")).toBeTrue();
	});

	it("returns false if the element can't be found", () => {
		expect([].remove("a")).toBeFalse();
	});
});
