import toImage from "src/extension/image-data/to-image";
import { HTMLImageElement, Image, ImageData } from "src/std/dom";

describe("WebFun.Extension.ImageData.toImage", () => {
	it("is an extension of ImageData to allow conversion to an HTMLImageElement", () => {
		expect(new ImageData(1, 1).toImage).toBe(toImage);
	});

	it("converts image data asynchronously to an image", async () => {
		const subject = new ImageData(
			new Uint8ClampedArray([
				...[...[0x00, 0x00, 0x00, 0xff], ...[0xff, 0xff, 0xff, 0xff]],
				...[...[0x00, 0xff, 0x00, 0xff], ...[0xff, 0x00, 0xff, 0xff]]
			]),
			2,
			2
		);
		const image = await subject.toImage();
		expect(image).toBeInstanceOf(HTMLImageElement);
		expect(image.src).toBe(
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAF0lEQVQYVwXBAQEAAACCIPs/mmAVtMR0Q+wH/DyFmbQAAAAASUVORK5CYII="
		);
	});

	it("image smoothing can be enabled", async () => {
		const subject = new ImageData(
			new Uint8ClampedArray([
				...[...[0x00, 0x00, 0x00, 0xff], ...[0xff, 0xff, 0xff, 0xff]],
				...[...[0x00, 0xff, 0x00, 0xff], ...[0xff, 0x00, 0xff, 0xff]]
			]),
			2,
			2
		);
		const image = await subject.toImage(false);
		expect(image).toBeInstanceOf(HTMLImageElement);
		expect(image.src).toBe(
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAF0lEQVQYVwXBAQEAAACCIPs/mmAVtMR0Q+wH/DyFmbQAAAAASUVORK5CYII="
		);
	});

	it("rejects the promise if conversion fails", async () => {
		const imageMock = new (class {
			set src(_) {
				setTimeout(() => imageMock.onerror());
			}
			get src() {
				return null;
			}
		})();

		const originalCreateElement = document.createElement;
		spyOn(document, "createElement").and.callFake(tag =>
			tag === "img" ? imageMock : originalCreateElement.call(document, tag)
		);

		try {
			const imageData = new ImageData(2, 2);
			await imageData.toImage();
		} catch (e) {
			expect(true).toBeTrue();
		}
	});
});
