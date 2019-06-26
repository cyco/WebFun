import identity from "src/util/identity";

describe("WebFun.Util.identity", () => {
	it("simply returns what's passed in, useful for filtering", () => {
		expect(identity(5)).toBe(5);
		expect(identity("test")).toBe("test");

		const array = [0, "", 3, null, "test", undefined];
		const filtered = array.filter(identity);
		expect(filtered).toEqual([3, "test"]);
	});
});
