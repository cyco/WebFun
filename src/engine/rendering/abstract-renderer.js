export default class AbstractRenderer {
	static isSupported() {
		return false;
	}

	get imageFactory() {
		return null;
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
}
