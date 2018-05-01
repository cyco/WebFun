import find from "src/extension/set/find";

describe("WebFun.Extension.Set.find", () => {
	it("extends the set prototype to support searching for items", () => {
		const set = new Set([1, 2, 3, 4]);
		expect(set.find).toBeFunction();
	});

	it("returns any item satisfying the predicate", () => {
		const set = new Set([1, 2, 3, 4]);
		expect([1, 3]).toContain(set.find(el => el % 2));
	});
});
