import drawImage from "src/app/webfun/rendering/canvas/draw-image";
import { ColorPalette } from "src/engine/rendering";
import { Size } from "src/util";

describe("WebFun.App.Rendering.Canvas.DrawImage", () => {
	let colorPalette: ColorPalette;
	beforeEach(() => {
		const paletteData = new Uint8Array([
			...[0, 0, 0],
			...[255, 0, 0],
			...[0, 255, 0],
			...[0, 0, 255]
		]);
		colorPalette = ColorPalette.FromBGR8(paletteData, 3);
	});

	it("converts raw pixel data to an ImageData object using a color palette ", async () => {
		const expectedPNGData =
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC";
		const pixels = new Uint8Array([0, 1, 2, 3]);
		const imageData = drawImage(pixels, new Size(1, 1), colorPalette);
		const actual = convertImageDataToPNG(imageData);
		expect(actual).toEqual(expectedPNGData);
	});

	function convertImageDataToPNG(imageData: ImageData): string {
		const canvas = document.createElement("canvas");
		canvas.width = 1;
		canvas.height = 1;
		canvas.getContext("2d").putImageData(imageData, 0, 0);
		return canvas.toDataURL(`image/png`);
	}
});
