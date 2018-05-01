import some from "src/extension/set/some";

describe("WebFun.Extension.Set.some", () => {
	it("extends the set prototype to support checking for the existance of items", () => {
		const set = new Set([1, 2, 3, 4]);
		expect(set.some).toBeFunction();
	});

	it("returns true if any item satifies the predicate", () => {
		const set = new Set([1, 2, 3, 4]);
		expect(set.some(el => el % 2)).toBe(true);
		expect(set.some(el => el === 0)).toBe(false);
	});
});
