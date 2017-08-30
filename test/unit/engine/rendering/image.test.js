import Image from "/engine/rendering/image";

describe("Image", () => {
	it("is a simple container representing an image", () => {
		const image = new Image(32, 28, {image: "representation"});

		expect(image.width).toEqual(32);
		expect(image.height).toEqual(28);
		expect(image.representation).toEqual({image: "representation"});
	});

	it("does not make any assumption on the representation used", () => {
		expect(() => new Image(32, 32, -12)).not.toThrow();
	});
});
