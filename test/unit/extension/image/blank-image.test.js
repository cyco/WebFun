import source from "/extension/image/blank-image";

describe("Image.blankImage", () => {
	it("is a static property that provides an image source for an invible image", () => {
		expect(() => {
			Image.blankImage;
		}).not.toThrow();

		expect(source).toBe(Image.blankImage);
	});
});
