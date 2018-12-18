import { AbstractImageFactory, ColorPalette, Image } from "src/engine/rendering";
import drawImage from "./draw-image";
import { Size } from "src/util";

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

	async buildImage(width: number, height: number, pixelData: ArrayLike<number>): Promise<Image> {
		console.assert(!!this._palette, "Can not build images before a palette is set.");
		const image = await drawImage(
			pixelData as Uint8Array,
			new Size(width, height),
			this.palette
		).toImage();
		return new Image(width, height, image);
	}

	public createImageData(width: number, height: number, pixelData: ArrayLike<number>): ImageData {
		return drawImage(pixelData as Uint8Array, new Size(width, height), this.palette);
	}
}

export default DOMImageFactory;
