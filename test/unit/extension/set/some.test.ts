import some from "src/extension/set/some";

describe("WebFun.Extension.Set.some", () => {
	it("extends the set prototype to support checking for the existence of items", () => {
		const set = new Set([1, 2, 3, 4]);
		expect(set.some).toBeFunction();
	});

	it("returns true if any item satisfies the predicate", () => {
		const set = new Set([1, 2, 3, 4]);
		expect(set.some((el: number) => el % 2 !== 0)).toBe(true);
		expect(set.some((el: number) => el === 0)).toBe(false);
	});
});
