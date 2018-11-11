import identity from "src/util/identity";

describe("WebFun.Util.identity", () => {
	it("simply returns what's passed in, useful for filtering", () => {
		expect(identity(5)).toBe(5);
		expect(identity("test")).toBe("test");

		let array = [0, "", 3, null, "test", undefined];
		let filtered = array.filter(identity);
		expect(filtered).toEqual([3, "test"]);
	});
});
