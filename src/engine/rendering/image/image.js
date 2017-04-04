let globalPalette;
import { EventTarget } from '/util';
import ImageLoaderFactory from './image-loader-factory';

export default class PaletteImage extends EventTarget {
	static SetPalette(p) {
		globalPalette = p;
	}

	static GetPalette() {
		return globalPalette;
	}

	constructor(data, width, height, palette = globalPalette) {
		super();

		this._palette = palette;
		this._data = data;
		this._width = width;
		this._height = height;
	}

	get palette() {
		return this._palette;
	}

	get data() {
		return this._data;
	}

	get dataURL() {
		return this._image && this._image.src;
	}

	get imageNode() {
		return this._image;
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}

	get loader() {
		const factory = new ImageLoaderFactory();
		return (this._loader = factory.buildLoader(this));
	}
}
