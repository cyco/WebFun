import AbstractImageFactory from "./abstract-image-factory";

abstract class AbstractRenderer {
	get imageFactory(): AbstractImageFactory {
		return null;
	}

	static isSupported(): boolean {
		return false;
	}

	clear() {}

	redisplayTile(_x: number, _y: number) {}

	redisplayRect(_x: number, _y: number, _width: number, _height: number) {}

	redisplay() {}

	renderZoneTile(_tile: any, _x: number, _y: number, _z: number) {}

	renderTile(_tile: any, _x: number, _y: number, _z: number) {}

	renderImage(_image: any, _x: number, _y: number) {}

	renderImageData(_image: any, _x: number, _y: number) {}

	fillBlackRect(_x: number, _y: number, _width: number, _height: number) {}
}

export default AbstractRenderer;
