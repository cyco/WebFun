import Range from "/util/range";
import { srand } from "/util/random";

describe("Range", () => {
	it("describes a simple 1 dimensional range of numbers", () => {
		let range = new Range(5, 7);

		expect(range.min).toBe(5);
		expect(range.max).toBe(7);
	});

	it("can return a random element within the range", () => {
		srand(0x42);

		let range = new Range(5, 7);
		expect(range.randomElement()).toBe(7);
		expect(range.randomElement()).toBe(5);
		expect(range.randomElement()).toBe(5);
		expect(range.randomElement()).toBe(5);
		expect(range.randomElement()).toBe(6);
	});
});
