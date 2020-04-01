import withType from "src/extension/array/with-type";

describe("WebFun.Extension.Array.withType", () => {
	it("filters objects based on their type property", () => {
		const array = [
			{ type: 2, name: "a" },
			{ type: 3, name: "b" },
			{ type: 2, name: "c" }
		];
		expect(array.withType(2).length).toBe(2);
	});
});
