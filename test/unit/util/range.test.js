import { srand } from "src/util/random";
import Range from "src/util/range";

describe("WebFun.Util.Range", () => {
	it("describes a simple 1 dimensional range of numbers", () => {
		const range = new Range(5, 7);

		expect(range.min).toBe(5);
		expect(range.max).toBe(7);
	});

	it("can return a random element within the range", () => {
		srand(0x42);

		const range = new Range(5, 7);
		expect(range.randomElement()).toBe(7);
		expect(range.randomElement()).toBe(5);
		expect(range.randomElement()).toBe(5);
		expect(range.randomElement()).toBe(5);
		expect(range.randomElement()).toBe(6);
	});
});
