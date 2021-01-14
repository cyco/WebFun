import { PI, sqrt } from "src/std/math";
import xy2polar from "src/util/xy2polar";

describe("WebFun.Util.xy2polar", () => {
	it("is a function used to convert x,y-coordinates to radius & distance", () => {
		expect(typeof xy2polar).toBe("function");
	});

	it("converts 0,0 correctly", () => {
		const [rho, theta] = xy2polar(0, 0);
		expect(rho).toBe(0);
		expect(theta).toBe(-0);
	});

	it("converts 0,1 correctly", () => {
		const [rho, theta] = xy2polar(0, 1);
		expect(rho).toBe(1);
		expect(theta).toBe(-PI / 2);
	});

	it("converts 1,1 correctly", () => {
		const [rho, theta] = xy2polar(1, 1);
		expect(rho).toBe(sqrt(2));
		expect(theta).toBe(-PI / 4);
	});

	it("converts -1,0 correctly", () => {
		const [rho, theta] = xy2polar(-1, 0);
		expect(rho).toBe(1);
		expect(theta).toBe(-PI);
	});
});
