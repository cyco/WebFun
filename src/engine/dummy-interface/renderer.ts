import { Renderer } from "../rendering";

class DummyRenderer implements Renderer {
	fillRect(_x: number, _y: number, _width: number, _height: number, _color: string): void {}
	renderImageData(_image: any, _x: number, _y: number): void {}
	renderImage(_image: any, _x: number, _y: number): void {}
	drawImage(_image: any, _atX: number, _atY: number): void {}
	clear(): void {}
	redisplayTile(_x: number, _y: number): void {}
	redisplayRect(_x: number, _y: number, _width: number, _height: number): void {}
	redisplay(): void {}
	fillBlackRect(_x: number, _y: number, _width: number, _height: number): void {}
}

export default DummyRenderer;
