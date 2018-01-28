import AbstractImageFactory from "../abstract-image-factory";
import ColorPalette from "../color-palette";
import Image from "../image";

class DOMImageFactory extends AbstractImageFactory {
	private _palette: ColorPalette = null;

	constructor(palette: ColorPalette = null) {
		super();
		this._palette = palette;
	}

	get palette() {
		return this._palette;
	}

	set palette(palette) {
		console.assert(!this._palette, "Color palette can not be changed once it's been set.");
		this._palette = palette;
	}

	buildImage(width: number, height: number, pixelData: ArrayLike<number>): Image {
		console.assert(!!this._palette, "Can not build images before a palette is set.");
		const imageData = this.createImageData(width, height, pixelData);

		const canvas = document.createElement("canvas");
		canvas.classList.add("pixelated");
		canvas.width = width;
		canvas.height = height;

		const context = canvas.getContext("2d");
		context.putImageData(imageData, 0, 0);

		const imageElement = <HTMLImageElement>new (<any>window).Image(width, height);
		imageElement.classList.add("pixelated");
		imageElement.src = canvas.toDataURL();

		return new Image(width, height, imageElement);
	}

	public createImageData(width: number, height: number, pixelData: ArrayLike<number>): ImageData {
		const palette = this._palette;
		const size = width * height;
		const imageData = new ImageData(width, height);
		const rawImageData = imageData.data;

		for (let i = 0; i < size; i++) {
			const paletteIndex = pixelData[i] * 4;

			rawImageData[4 * i + 0] = palette[paletteIndex + 2];
			rawImageData[4 * i + 1] = palette[paletteIndex + 1];
			rawImageData[4 * i + 2] = palette[paletteIndex + 0];
			rawImageData[4 * i + 3] = paletteIndex === 0 ? 0x00 : 0xff;
		}

		return imageData;
	}
}

export default DOMImageFactory;
