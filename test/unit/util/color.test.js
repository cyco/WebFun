import { rgb, rgba } from "src/util/color";

describe("Color", () => {
	it("defines two funtions in the global namespace", () => {
		expect(typeof rgb).toBe("function");
		expect(typeof rgba).toBe("function");
	});

	describe("rgb", () => {
		it("simply returns a string with the color components supplied", () => {
			let result = rgb(255, 255, 255);
			expect(result).toBe("rgb(255,255,255)");
		});
	});
	describe("rgba", () => {
		it("does the same as rgb but contains an alpha component", () => {
			let result = rgba(255, 255, 255, 1.0);
			expect(result).toBe("rgba(255,255,255,1)");
		});
	});
});
