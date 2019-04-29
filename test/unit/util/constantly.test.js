import constantly from "src/util/constantly";

describe("WebFun.Util.constantly", () => {
	it("returns a function that always evaluates to the given input", () => {
		let newFn = constantly(5);

		expect(newFn()).toBe(5);
		expect(newFn()).toBe(5);

		const obj = {
			x: "test"
		};
		newFn = constantly(obj);
		expect(newFn()).toBe(obj);
		expect(newFn()).toBe(obj);
	});
});
