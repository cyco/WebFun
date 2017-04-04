import SkippingLoader from './skipping-image-loader';
import ImageLoader from './image-loader';

export default class {
	constructor() {}

	buildLoader(image) {
		if (image.fallback !== undefined) {
			let fallbackString = '' + image.fallback;
			while (fallbackString.length < 4) {
				fallbackString = '0' + fallbackString;
			}

			let url = './data/tiles/' + fallbackString + '.png';
			image._image = new Image();
			image._image.width = 32;
			image._image.height = 32;
			image._image.src = url;

			return new SkippingLoader(image, Image.blankImage);
		}

		if (image._loader) return image._loader;
		if (image.dataURL) return null;

		return new ImageLoader(image);
	}
}
