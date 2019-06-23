import toImageData from "src/extension/image/to-image-data";
import { Image, ImageData } from "src/std/dom";

describe("WebFun.Extension.Image.toImageData", () => {
	let subject: any;

	beforeEach(done => {
		subject = new Image(2, 2) as any;
		subject.onload = done;
		subject.src =
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAF0lEQVQYVwXBAQEAAACCIPs/mmAVtMR0Q+wH/DyFmbQAAAAASUVORK5CYII=";
	});

	it("is an extension on HTMLImageElement to allow conversion to ImageData", () => {
		expect(subject.toImageData).toBe(toImageData);
	});

	it("creates an image data object from the image's src", () => {
		const imageData = subject.toImageData();
		expect(imageData).toBeInstanceOf(ImageData);
		expect(imageData.width).toBe(2);
		expect(imageData.height).toBe(2);
		expect(imageData.data).toEqual(
			new Uint8ClampedArray([
				...[...[0x00, 0x00, 0x00, 0xff], ...[0xff, 0xff, 0xff, 0xff]],
				...[...[0x00, 0xff, 0x00, 0xff], ...[0xff, 0x00, 0xff, 0xff]]
			])
		);
	});

	it("can be created with image smoothing enabled", () => {
		const imageData = subject.toImageData();
		expect(imageData).toBeInstanceOf(ImageData);
		expect(imageData.width).toBe(2);
		expect(imageData.height).toBe(2);
		expect(imageData.data).toEqual(
			new Uint8ClampedArray([
				...[...[0x00, 0x00, 0x00, 0xff], ...[0xff, 0xff, 0xff, 0xff]],
				...[...[0x00, 0xff, 0x00, 0xff], ...[0xff, 0x00, 0xff, 0xff]]
			])
		);
	});
});
