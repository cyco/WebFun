export default class AbstractRenderer {
	static isSupported() {
		return false;
	}

	clear() {
	}

	redisplayTile(x, y) {
	}

	redisplayRect(x, y, width, height) {
	}

	redisplay() {
	}

	renderTile(tile, x, y, z) {
	}

	renderImage(image, x, y) {
	}

	renderImageData(image, x, y) {
	}

	fillBlackRect(x, y, width, height) {
	}

	get imageFactory() {
		return null;
	}
}
