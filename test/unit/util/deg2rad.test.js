import { PI } from "src/std/math";
import deg2rad from "src/util/deg2rad";

describe("deg2rad", () => {
	it("is a function that converts degrees to radians", () => {
		expect(typeof deg2rad).toBe("function");
	});

	it("correctly converts 0°", () => {
		expect(deg2rad(0)).toEqual(0);
	});

	it("correctly converts 90°", () => {
		expect(deg2rad(90)).toEqual(PI / 2);
	});

	it("correctly converts 180°", () => {
		expect(deg2rad(180)).toEqual(PI);
	});

	it("correctly converts 270°", () => {
		expect(deg2rad(270)).toEqual(1.5 * PI);
	});

	it("correctly converts 360", () => {
		expect(deg2rad(0)).toEqual(0);
	});
});
