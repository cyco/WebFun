import constantly from "src/util/constantly";

describe("constantly", () => {
	it("returns a function that always evaluates to the given input", () => {
		let newFn = constantly(5);

		expect(newFn()).toBe(5);
		expect(newFn()).toBe(5);

		let obj = {
			x: "test"
		};
		newFn = constantly(obj);
		expect(newFn()).toBe(obj);
		expect(newFn()).toBe(obj);
	});
});
