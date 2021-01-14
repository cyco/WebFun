import { Image } from "src/std/dom";
import source from "src/extension/image/blank-image";

describe("WebFun.Extension.Image.blankImage", () => {
	it("is a static property that provides an image source for an invisible image", () => {
		expect(() => {
			Image.blankImage;
		}).not.toThrow();

		expect(source).toBe(Image.blankImage);
	});
});
