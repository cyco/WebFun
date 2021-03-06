import { rand, randmod, srand } from "src/util/random";

describe("WebFun.Util.Random", () => {
	it("defines the functions srand and rand", () => {
		expect(typeof srand).toBe("function");
		expect(typeof rand).toBe("function");
	});

	it("implements a prng spitting out 16-bit values", () => {
		const expectedValues = [
			0x0029,
			0x4823,
			0x18be,
			0x6784,
			0x4ae1,
			0x3d6c,
			0x2cd6,
			0x72ae,
			0x6952,
			0x5f90
		];

		srand(0x0001);
		for (let i = 0; i < 10; i++) {
			const randomNumber = rand();
			expect(randomNumber).toEqual(expectedValues[i]);
		}
	});

	it("overflows correctly (looking at you phantomjs)", () => {
		srand(0x0000);
		for (let i = 0; i < 312; i++) {
			rand();
		}

		expect(rand()).toBe(1);
		expect(rand()).toBe(28115);
	});

	it("can be constraint to a range", () => {
		srand(0x0000);
		for (let i = 0; i < 312; i++) {
			expect(randmod(10)).toBeLessThanOrEqual(9);
		}
	});
});
