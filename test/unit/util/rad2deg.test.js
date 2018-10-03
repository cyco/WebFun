import { PI } from "src/std/math";
import rad2deg from "src/util/rad2deg";

describe("rad2deg", () => {
	it("is a function that converts radians to degrees", () => {
		expect(typeof rad2deg).toBe("function");
	});

	it("converts 0 correctly", () => {
		expect(rad2deg(0)).toBe(0);
	});

	it("converts PI/2 correctly", () => {
		expect(rad2deg(PI / 2)).toBe(90);
	});

	it("converts PI correctly", () => {
		expect(rad2deg(PI)).toBe(180);
	});

	it("converts 1.5 * PI correctly", () => {
		expect(rad2deg(1.5 * PI)).toBe(270);
	});

	it("converts 2 PI correctly", () => {
		expect(rad2deg(2 * PI)).toBe(360);
	});
});
