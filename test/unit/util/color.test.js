import { default as Color, hsv2rgb, rgb, rgb2hsv, rgb2rgba, rgba } from "src/util/color";

describe("WebFun.Util.Color", () => {
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

	describe("rgb2rgba", () => {
		it("simply adds an alpha component of 1", () => {
			expect(rgb2rgba(0.0, 1.0, 0.5)).toEqual([0, 1.0, 0.5, 1]);
		});
	});

	describe("hsv2rgb", () => {
		it("converts hsv color values to rgb", () => {
			expect(hsv2rgb(0, 0, 0)).toEqual([0, 0, 0]);
			expect(hsv2rgb(0, 0, 1)).toEqual([0xff, 0xff, 0xff]);
			expect(hsv2rgb(0, 1, 1)).toEqual([0xff, 0, 0]);
			expect(hsv2rgb(120, 1, 1)).toEqual([0, 0xff, 0]);
			expect(hsv2rgb(240, 1, 1)).toEqual([0, 0, 0xff]);
			expect(hsv2rgb(180, 1, 1)).toEqual([0, 0xff, 0xff]);
			expect(hsv2rgb(300, 1, 1)).toEqual([0xff, 0, 0xff]);
			expect(hsv2rgb(60, 1, 1)).toEqual([0xff, 0xff, 0]);
			expect(hsv2rgb(-420, 1, 1)).toEqual([0xff, 0, 0xff]);
		});
	});

	describe("rgb2hsv", () => {
		it("converts rgb color values to hsv", () => {
			expect(rgb2hsv(0, 0, 0)).toEqual([0, 0, 0]);
			expect(rgb2hsv(0xff, 0xff, 0xff)).toEqual([0, 0, 1]);
			expect(rgb2hsv(0xff, 0, 0)).toEqual([0, 1, 1]);
			expect(rgb2hsv(0, 0xff, 0)).toEqual([120, 1, 1]);
			expect(rgb2hsv(0, 0, 0xff)).toEqual([240, 1, 1]);
			expect(rgb2hsv(0, 0xff, 0xff)).toEqual([180, 1, 1]);
			expect(rgb2hsv(0xff, 0, 0xff)).toEqual([300, 1, 1]);
			expect(rgb2hsv(0xff, 0xff, 0)).toEqual([60, 1, 1]);

			expect(rgb2hsv(0xaa, 0x22, 0x44)).toEqual([345, 0.8, 2 / 3]);
		});
	});

	describe("Color", () => {
		let subject;
		it("can be constructed using rgb(a) components", () => {
			subject = new Color(1, 2, 3, 0.75);

			expect(subject.rgbComponents).toEqual([1, 2, 3]);
			expect(subject.rgbaComponents).toEqual([1, 2, 3, 0.75]);
		});

		it("can be constructed using a different color object", () => {
			const aColor = new Color(1, 2, 3, 0.75);

			subject = new Color(aColor);
			expect(subject.rgbComponents).toEqual([1, 2, 3]);
			expect(subject.rgbaComponents).toEqual([1, 2, 3, 0.75]);
		});

		it("can be created from HSV components", () => {
			const aColor = new Color(1, 2, 3);

			subject = Color.FromHSV(...aColor.hsvComponents);
			expect(subject.rgbComponents).toEqual([1, 2, 3]);
			expect(subject.rgbaComponents).toEqual([1, 2, 3, 1.0]);
		});

		it("can be constructed using css-like strings components", () => {
			subject = new Color("rgba(1,2,3, 0.74)");
			expect(subject.rgbComponents).toEqual([1, 2, 3]);
			expect(subject.rgbaComponents).toEqual([1, 2, 3, 0.74]);

			subject = new Color("rgb(1,2,3)");
			expect(subject.rgbComponents).toEqual([1, 2, 3]);
			expect(subject.rgbaComponents).toEqual([1, 2, 3, 1]);

			subject = new Color("#00Ff00");
			expect(subject.rgbComponents).toEqual([0, 255, 0]);

			subject = new Color("hsv(60, 1, 1)");
			expect(subject.rgbComponents).toEqual([0xff, 0xff, 0]);
			expect(subject.rgbaComponents).toEqual([0xff, 0xff, 0, 1]);
		});

		it("is initialized to black if no proper initialization options are given", () => {
			subject = new Color(null);
			expect(subject.rgbaComponents).toEqual([0, 0, 0, 1]);
		});

		it("can be used to convert between color spaces", () => {
			subject = new Color(1, 2, 3, 0.75);
			expect(subject.hsvComponents).toEqual([210.0, 0.6666666666666666, 0.011764705882352941]);

			subject = new Color(255, 255, 255);
			expect(subject.hsvComponents).toEqual([0, 0, 1]);

			subject = new Color(0, 255, 255);
			expect(subject.hsvComponents).toEqual([180.0, 1, 1]);

			subject = new Color(0, 0, 255);
			expect(subject.hsvComponents).toEqual([240.0, 1, 1]);

			subject = new Color(0, 0, 0);
			expect(subject.hsvComponents).toEqual([0, 0, 0]);
		});

		it("prints nicely as a string so it can be parsed again later", () => {
			const aColor = new Color(1, 2, 3, 0.75);
			const subject = new Color("" + aColor);

			expect(subject.rgbaComponents).toEqual(aColor.rgbaComponents);
		});

		it("throws an exception when the string can't be parsed", () => {
			expect(() => new Color("garbage")).toThrow();
		});
	});
});
