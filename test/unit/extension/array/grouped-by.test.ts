import groupedBy from "src/extension/array/grouped-by";
import { floor } from "src/std/math";

describe("WebFun.Extension.Array.groupedBy", () => {
	it("extends to array prototype to group elements in an array", () => {
		expect(typeof groupedBy).toBe("function");
		expect(typeof [].groupedBy).toBe("function");
	});

	it("groups elements in arrays based on the return value of the callback", () => {
		const array = [1, 1.1, 2.6, 1.2, 1.3, 2, 2.3, 2.1];
		const result = array.groupedBy(floor);

		expect(result).toEqual([
			[1, 1.1, 1.2, 1.3],
			[2.6, 2, 2.3, 2.1]
		]);
	});
});
