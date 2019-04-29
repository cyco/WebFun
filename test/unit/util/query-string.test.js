import QueryString from "src/util/query-string";

describe("WebFun.Util.QueryString", () => {
	it("has a method to create a query string from an object", () => {
		expect(typeof QueryString.Compose).toBe("function");

		const result = QueryString.Compose({ x: "test", y: 10 });
		expect(result).toBe("x=test&y=10");
	});
});
