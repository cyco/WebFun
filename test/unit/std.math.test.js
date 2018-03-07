import { global } from "src/std";
import { floor, ceil, round } from "src/std.math";

describe("std.math", () => {
	it("exports functions from global.Math", () => {
		expect(floor).toBe(global.Math.floor);
		expect(ceil).toBe(global.Math.ceil);
		expect(round).toBe(global.Math.round);
	});
});
