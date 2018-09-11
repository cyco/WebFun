import DOMImageFactory from "src/engine/rendering/canvas/dom-image-factory";
import { Image } from "std.dom";

describe("DOMImageFactory", () => {
	const colorPalette = [
		...[0, 0, 0, 0], // transparent
		...[0, 0, 0, 0], // black
		...[255, 255, 255, 0], // white
		...[255, 0, 0, 1], // red
		...[0, 255, 0, 1], // green
		...[0, 0, 255, 1] // blue
	];

	it("it is a class that builds images from palette and pixel data", () => {
		expect(DOMImageFactory).toBeClass();
	});

	it("uses a color palette", () => {
		const factory = new DOMImageFactory();
		factory.palette = colorPalette;

		expect(factory.palette).toBe(colorPalette);
	});

	it("can be used to build images", async done => {
		const factory = new DOMImageFactory();
		factory.palette = colorPalette;

		const pixelData = [0, 1, 2, 3, 4, 5];
		const image = factory.buildImage(3, 2, pixelData);
		expect(image.width).toBe(3);
		expect(image.height).toBe(2);

		const representation = await image.representation;
		expect(representation).toBeInstanceOf(HTMLImageElement);
		done();
	});
});
