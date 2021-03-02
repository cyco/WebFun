import _ from "src/extension/array/random";
import * as Math from "src/std/math";

describe("WebFun.Extension.Array.random", () => {
	it("extends the Array prototype", () => {
		const array = [1, 2, 3];
		expect(array.random).toBeFunction();
	});

	it("picks a random element from the array", () => {
		spyOn(Math, "random").and.returnValues(0, 0.2, 0.4, 0.8);
		const array = ["a", "b", "c"];

		expect(array.random()).toBe("a");
		expect(array.random()).toBe("a");
		expect(array.random()).toBe("b");
		expect(array.random()).toBe("c");
	});
});
