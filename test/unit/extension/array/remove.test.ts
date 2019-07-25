describe("WebFun.Extension.Array.remove", () => {
	it("it extends the Array prototype", () => {
		const array: any[] = [];
		expect(array.remove).toBeFunction();
	});

	it("simply removes the element from the array", () => {
		const array = ["a", "b", "c"];
		array.remove("b");
		expect(array).toEqual(["a", "c"]);
	});

	it("only removes the first instance of an element", () => {
		const array = ["b", "b", "c", "b"];
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
