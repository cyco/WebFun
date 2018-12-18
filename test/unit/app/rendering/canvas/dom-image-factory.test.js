import DOMImageFactory from "src/app/rendering/canvas/dom-image-factory";
import { Image } from "std/dom";

describe("WebFun.App.Rendering.Canvas.DOMImageFactory", () => {
	const CompressedColorPalette = new Uint8Array([
		...[0, 0, 0, 0], // transparent
		...[0, 0, 0, 0], // black
		...[255, 255, 255, 0], // white
		...[255, 0, 0, 1], // red
		...[0, 255, 0, 1], // green
		...[0, 0, 255, 1], // blue
		// fill up remaining size
		...Array.from({ length: 0x400 - 6 * 4 })
	]);

	it("it is a class that builds images from palette and pixel data", () => {
		expect(DOMImageFactory).toBeClass();
	});

	it("uses a color palette", () => {
		const factory = new DOMImageFactory();
		factory.palette = CompressedColorPalette;

		expect(factory.palette).toBe(CompressedColorPalette);
	});

	it("can be used to build images", async done => {
		const factory = new DOMImageFactory();
		factory.palette = CompressedColorPalette;

		const pixelData = [0, 1, 2, 3, 4, 5];
		const image = await factory.buildImage(3, 2, pixelData);
		expect(image.width).toBe(3);
		expect(image.height).toBe(2);

		const representation = image.representation;
		expect(representation).toBeInstanceOf(HTMLImageElement);
		done();
	});
});
