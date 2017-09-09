import AbstractImageFactory from "./abstract-image-factory";

abstract class AbstractRenderer {
	static isSupported(): boolean {
		return false;
	}

	clear() {
	}

	redisplayTile(x: number, y: number) {
	}

	redisplayRect(x: number, y: number, width: number, height: number) {
	}

	redisplay() {
	}

	renderTile(tile: any, x: number, y: number, z: number) {
	}

	renderImage(image: any, x: number, y: number) {
	}

	renderImageData(image: any, x: number, y: number) {
	}

	fillBlackRect(x: number, y: number, width: number, height: number) {
	}

	get imageFactory(): AbstractImageFactory {
		return null;
	}
}

export default AbstractRenderer;
