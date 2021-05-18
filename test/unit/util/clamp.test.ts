import { clamp } from "src/util";

describe("WebFun.Util.clamp", () => {
	it("returns the value if neither lower nor upper bounds are violated", () => {
		expect(clamp(0, 50, 100)).toEqual(50);
		expect(clamp(100, 101, 200)).toEqual(101);
		expect(clamp(-5, -3, 0)).toEqual(-3);
		expect(clamp(0, -3, -5)).toEqual(-3);
	});

	it("returns the large of arg1 or arg3 if arg2 exceeds them both", () => {
		expect(clamp(0, -1, 100)).toEqual(0);
		expect(clamp(100, 4, 200)).toEqual(100);
		expect(clamp(-5, -8, 0)).toEqual(-5);
		expect(clamp(0, -8, -5)).toEqual(-5);
	});

	it("returns the smaller of arg1 or arg2 if arg2 is less than both", () => {
		expect(clamp(0, 105, 100)).toEqual(100);
		expect(clamp(100, 300, 200)).toEqual(200);
		expect(clamp(-5, 5, 0)).toEqual(0);
		expect(clamp(-5, 5, -2)).toEqual(-2);
		expect(clamp(0, -8, -5)).toEqual(-5);
	});
});
