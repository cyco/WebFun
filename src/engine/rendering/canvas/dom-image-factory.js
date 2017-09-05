import AbstractImageFactory from "../abstract-image-factory";
import Image from "../image";
import { Image as DOMImage, ImageData } from "std.dom";

export default class extends AbstractImageFactory {
	constructor() {
		super();
		this._palette = null;
	}

	buildImage(width, height, pixelData) {
		console.assert(this._palette, "Can not build images before a palette is set.");

		const palette = this._palette;
		const size = width * height;
		const imageData = new ImageData(width, height);
		const rawImageData = imageData.data;

		for (let i = 0; i < size; i++) {
			const paletteIndex = pixelData[i] * 4;

			rawImageData[4 * i + 0] = palette[paletteIndex + 2];
			rawImageData[4 * i + 1] = palette[paletteIndex + 1];
			rawImageData[4 * i + 2] = palette[paletteIndex + 0];
			rawImageData[4 * i + 3] = paletteIndex === 0 ? 0x00 : 0xFF;
		}

		const canvas = document.createElement("canvas");
		canvas.classList.add("pixelated");
		canvas.width = width;
		canvas.height = height;

		const context = canvas.getContext("2d");
		context.putImageData(imageData, 0, 0);

		const imageElement = new DOMImage(width, height);
		imageElement.classList.add("pixelated");
		imageElement.src = canvas.toDataURL();

		return new Image(width, height, imageElement);
	}

	get palette() {
		return this._palette;
	}

	set palette(palette) {
		console.assert(!this._palette, "Color palette can not be changed once it's been set.");
		this._palette = palette;
	}
}
